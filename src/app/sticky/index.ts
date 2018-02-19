import { Portal, PortalModule, CdkPortal } from "@angular/cdk/portal";
import { Component, NgModule, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
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
        if (index !== -1) {
            this._outlets.splice(index, 1);
        }
    }
    
    public sendToOutlet (outletName: string, content: Portal<any>) {
        let outlet = this._outlets.find(o => o.name === outletName);
        if (outlet) {
            outlet.addContent(content);
        }
    }
    
    public pullFromOutlet (outletName: string, content: Portal<any>) {
        let outlet = this._outlets.find(o => o.name === outletName);
        if (outlet) {
            outlet.removeContent(content);
        }
    }
}

@Component({
    selector: 'sb-sticky-content',
    template: `
        <ng-template
            cdkPortal
            #template="cdkPortal">
            <ng-content></ng-content>
        </ng-template>
    `
})
export class StickyContentComponent implements OnInit, OnDestroy {

    @Input() public target: string;

    @ViewChild('template') private _portal: CdkPortal;

    constructor (
        private _stickyService: StickyService
    ) {}

    public ngOnInit () {
        if (this._portal && this.target) {
            this._stickyService.sendToOutlet(this.target, this._portal);
        }
    }

    public ngOnDestroy(): void {
        this._stickyService.pullFromOutlet(this.target, this._portal);
    }
}

export interface StickyContentRecord {
    id: number;
    content: Portal<any>;
}

let _UID = 0;

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
    
    public contentRecords: StickyContentRecord[] = [];

    constructor (
        private _stickyService: StickyService
    ) {}

    public ngOnInit () {
        this._stickyService.registerOutlet(this);
    }

    public ngOnDestroy(): void {
        this._stickyService.unregisterOutlet(this);
    }
    
    public addContent (content: Portal<any>) {
        this.contentRecords.push({ id: _UID++, content });
    }

    public removeContent (content: Portal<any>) {
        let index = this.contentRecords.findIndex(r => r.content === content);
        if (index !== -1) {
            this.contentRecords.splice(index, 1);
        }
    }

    public trackByContentId (record: StickyContentRecord) {
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
        StickyContentComponent
    ],
    exports: [
        StickyOutletComponent,
        StickyContentComponent
    ]
})
export class StickyModule {

}