import { Portal, PortalModule, CdkPortal, TemplatePortal } from "@angular/cdk/portal";
import { Component, NgModule, Input, OnDestroy, OnInit, ViewChild, TemplateRef, ViewContainerRef, Directive } from "@angular/core";
import { CommonModule } from "@angular/common";

export class TeleportService {

    private _outlets: TeleportOutletComponent[] = [];

    public registerOutlet (outlet: TeleportOutletComponent) {
        if (this._outlets.indexOf(outlet) === -1) {
            this._outlets.push(outlet);
        }
    }

    public unregisterOutlet (outlet: TeleportOutletComponent) {
        let index = this._outlets.indexOf(outlet);
        if (index >= 0) {
            this._outlets.splice(index, 1);
        }
    }

    private _findOutletByName (outletName: string): TeleportOutletComponent {
        let outlet = this._outlets.find(o => o.name === outletName);
        if (!outlet) {
            throw new Error(`Unable to find outlet '${outletName}'`);
        }
        return outlet;
    }
    
    public addToOutlet (outletName: string, content: Portal<any>, priority = 0) {
        this._findOutletByName(outletName).addContent(content, priority);
    }
    
    public removeFromOutlet (outletName: string, content: Portal<any>) {
        this._findOutletByName(outletName).removeContent(content);
    }
}

@Directive({
    selector: '[sbTeleportContent]',
    exportAs: 'sbTeleportContent'
})
export class TeleportContentDirective extends TemplatePortal implements OnInit, OnDestroy {

    @Input('sbTeleportTarget') public target: string;
    @Input('sbTeleportPriority') public priority: string;

    constructor (
        private _stickyService: TeleportService,
        templateRef: TemplateRef<any>,
        viewContainerRef: ViewContainerRef
    ) {
        super(templateRef, viewContainerRef);
    }

    public ngOnInit () {
        let priority = parseInt(this.priority, 10) || 0;
        this._stickyService.addToOutlet(this.target, this, priority);
    }

    public ngOnDestroy(): void {
        this._stickyService.removeFromOutlet(this.target, this);
    }
}

export interface TeleportContentRecord {
    id: number;
    priority: number;
    sort: number;
    content: Portal<any>;
}

@Component({
    selector: 'sb-teleport-outlet',
    template: `
        <ng-container
            *ngFor="let record of contentRecords; trackBy: trackByContentId">
            <ng-container
                [cdkPortalOutlet]="record.content">
            </ng-container>
        </ng-container>
    `
})
export class TeleportOutletComponent implements OnInit, OnDestroy {

    @Input() public name: string;
    @Input() public stack: 'up'|'down';
    
    public contentRecords: TeleportContentRecord[] = [];

    private _uid = 1;

    constructor (
        private _stickyService: TeleportService
    ) {}

    public ngOnInit () {
        this._stickyService.registerOutlet(this);
    }

    public ngOnDestroy(): void {
        this._stickyService.unregisterOutlet(this);
        this.contentRecords.length = 0;
    }
    
    public addContent (content: Portal<any>, priority = 1) {
        if (priority <= 0) {
            priority = 1;
        }
        this.contentRecords.push({ id: this._uid, priority, content, sort: priority });
        let sorter = (this.stack === 'up')
            ? (a, b) => a.sort - b.sort
            : (a, b) => b.sort - a.sort;
        this.contentRecords.sort(sorter);
        this._uid++;
    }

    public removeContent (content: Portal<any>) {
        let index = this.contentRecords.findIndex(r => r.content === content);
        if (index !== -1) {
            this.contentRecords.splice(index, 1);
            this._uid--;
        }
    }

    public trackByContentId (index: number, record: TeleportContentRecord) {
        return record.id;
    }
}

@NgModule({
    imports: [
        CommonModule,
        PortalModule
    ],
    providers: [
        TeleportService
    ],
    declarations: [
        TeleportOutletComponent,
        TeleportContentDirective
    ],
    exports: [
        TeleportOutletComponent,
        TeleportContentDirective
    ]
})
export class TeleportModule {

}