import { Portal, PortalModule, CdkPortal, TemplatePortal } from "@angular/cdk/portal";
import { Component, NgModule, Input, OnDestroy, OnInit, ViewChild, TemplateRef, ViewContainerRef, Directive } from "@angular/core";
import { CommonModule } from "@angular/common";

export class StickyService {

    private _outlets: StickyOutletComponent[] = [];

    public registerOutlet (outlet: StickyOutletComponent) {
        if (this._outlets.indexOf(outlet) === -1) {
            this._outlets.push(outlet);
        }
    }

    public unregisterOutlet (outlet: StickyOutletComponent) {
        let index = this._outlets.indexOf(outlet);
        if (index >= 0) {
            this._outlets.splice(index, 1);
        }
    }

    private _findOutletByName (outletName: string): StickyOutletComponent {
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
    selector: '[sbStickyContent]',
    exportAs: 'sbStickyContent'
})
export class StickyContentDirective extends TemplatePortal implements OnInit, OnDestroy {

    @Input('sbStickyTarget') public target: string;
    @Input('sbStickyPriority') public priority: string;

    constructor (
        private _stickyService: StickyService,
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

export interface StickyContentRecord {
    id: number;
    priority: number;
    sort: number;
    content: Portal<any>;
}

@Component({
    selector: 'sb-sticky-outlet',
    template: `
        <ng-container
            *ngFor="let record of contentRecords; trackBy: trackByContentId">
            <ng-container
                [cdkPortalOutlet]="record.content">
            </ng-container>
        </ng-container>
    `
})
export class StickyOutletComponent implements OnInit, OnDestroy {

    @Input() public name: string;
    @Input() public stack: 'up'|'down';
    
    public contentRecords: StickyContentRecord[] = [];

    private _uid = 1;

    constructor (
        private _stickyService: StickyService
    ) {}

    public ngOnInit () {
        this._stickyService.registerOutlet(this);
    }

    public ngOnDestroy(): void {
        this._stickyService.unregisterOutlet(this);
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

    public trackByContentId (index: number, record: StickyContentRecord) {
        return record.id;
    }
}

@NgModule({
    imports: [
        CommonModule,
        PortalModule
    ],
    providers: [
        StickyService
    ],
    declarations: [
        StickyOutletComponent,
        StickyContentDirective
    ],
    exports: [
        StickyOutletComponent,
        StickyContentDirective
    ]
})
export class StickyModule {

}