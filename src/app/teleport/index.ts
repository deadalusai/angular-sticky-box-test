import { PortalModule, Portal, TemplatePortal } from "@angular/cdk/portal";
import { NgModule, Component, Input, OnDestroy, OnInit, ViewChild, TemplateRef, ViewContainerRef, Directive, SimpleChange, SimpleChanges, OnChanges } from "@angular/core";
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

    public findOutletByName (outletName: string): TeleportOutletComponent {
        let outlet = this._outlets.find(o => o.name === outletName);
        if (!outlet) {
            throw new Error(`Unable to find outlet '${outletName}'`);
        }
        return outlet;
    }
}

@Directive({
    selector: '[sbTeleport]',
    exportAs: 'sbTeleport'
})
export class TeleportContentDirective extends TemplatePortal implements OnChanges, OnInit, OnDestroy {

    @Input('sbTeleport') public target: string;
    @Input('sbTeleportPriority') public priority: string;

    private _outlet: TeleportOutletComponent;

    constructor (
        private _stickyService: TeleportService,
        templateRef: TemplateRef<any>,
        viewContainerRef: ViewContainerRef
    ) {
        super(templateRef, viewContainerRef);
    }

    public ngOnChanges (changes: SimpleChanges) {
        let { target } = changes;
        if (target && !target.isFirstChange()) {
            this._updateTeleport();
        }
    }

    public ngOnInit () {
        this._updateTeleport();
    }

    public ngOnDestroy(): void {
        if (this._outlet) {
            this._outlet.removeContent(this);
            this._outlet = null;
        }
    }

    private _updateTeleport () {
        let newOutlet = this._stickyService.findOutletByName(this.target);

        if (this._outlet === newOutlet) {
            return;
        }

        if (this._outlet) {
            this._outlet.removeContent(this);
        }

        let priority = parseInt(this.priority, 10) || 0;
        newOutlet.addContent(this, priority);
        
        this._outlet = newOutlet;
    }
}

export interface TeleportContentRecord {
    id: number;
    priority: number;
    content: Portal<any>;
}

const SORT_ASC  = (a: TeleportContentRecord, b: TeleportContentRecord) => a.priority - b.priority;
const SORT_DESC = (a: TeleportContentRecord, b: TeleportContentRecord) => b.priority - a.priority;

@Component({
    selector: 'sb-teleport-outlet',
    template: `
        <ng-container
            *ngFor="let record of records; trackBy: trackByContentId">
            <ng-container
                [cdkPortalOutlet]="record.content">
            </ng-container>
        </ng-container>
    `
})
export class TeleportOutletComponent implements OnInit, OnDestroy {

    @Input() public name: string;
    @Input() public stack: 'up' | 'down';
    
    public records: TeleportContentRecord[] = [];

    private _uid = 1;

    constructor (
        private _stickyService: TeleportService
    ) {}

    public ngOnInit () {
        this._stickyService.registerOutlet(this);
    }

    public ngOnDestroy(): void {
        this._stickyService.unregisterOutlet(this);
        this.records.length = 0;
    }
    
    public addContent (content: Portal<any>, priority = 1) {
        if (priority <= 0) {
            priority = 1;
        }
        this.records.push({ id: this._uid, priority, content });
        this.records.sort(this.stack === 'up' ? SORT_ASC : SORT_DESC);
        this._uid++;
    }

    public removeContent (content: Portal<any>) {
        let index = this.records.findIndex(r => r.content === content);
        if (index !== -1) {
            this.records.splice(index, 1);
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