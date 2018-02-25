import { Component, NgModule, Input, ViewChild, OnInit, OnDestroy, ElementRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Portal, CdkPortal, CdkPortalOutlet, PortalModule } from "@angular/cdk/portal";
import { TeleportModule, TeleportOutletComponent, TeleportService } from "../teleport";

import { Observable, Subject } from "rxjs";
import { fromEvent } from "rxjs/observable/fromEvent";
import { merge } from "rxjs/observable/merge"
import { takeUntil } from "rxjs/operators";

let _uid = 1;

@Component({
    selector: 'sb-sticky-box',
    styles: [`
        :host {
            display: block;
        }
    `],
    template: `
        <sb-teleport-outlet
            [name]="localOutletName">
        </sb-teleport-outlet>
        <ng-template
            [sbTeleport]="isSticky ? target : localOutletName">
            <ng-content>
            </ng-content>
        </ng-template>
    `
})
export class StickyBoxComponent implements OnInit, OnDestroy {

    @Input() target: string;

    public localOutletName: string;
    public isSticky: boolean;

    private _destroy$ = new Subject();

    constructor (
        private _elementRef: ElementRef,
        private _teleportService: TeleportService
    ) {
        this.localOutletName = `stickybox${_uid++}`;
    }

    public ngOnInit () {
        // Global scroll/resize listeners
        merge(
            fromEvent(window, 'scroll'),
            fromEvent(window, 'resize')
        )
        .pipe(takeUntil(this._destroy$))
        .subscribe(() => {
            this._update();
        });

        this._update();
    }

    public ngOnDestroy () {
        this._destroy$.next();
    }

    private _update () {
        let viewportHeight = document.documentElement.clientHeight;
        let contentEl = this._elementRef.nativeElement as HTMLElement;
        let contentRect = contentEl.getBoundingClientRect();

        console.log(`top:`, contentRect.top);
        // console.log(`viewport height:`, viewportHeight);
        // console.log(`content rect:`, contentRect);
        
        if (contentRect.top > 0) {
            contentEl.style.height = null;
            contentEl.style.display = null;
            this.isSticky = false;
        }
        else {
            contentEl.style.height = contentRect.height + 'px';
            contentEl.style.display = 'block';
            this.isSticky = true;
        }
    }
}

@NgModule({
    imports: [
        CommonModule,
        TeleportModule
    ],
    declarations: [
        StickyBoxComponent
    ],
    exports: [
        StickyBoxComponent
    ]
})
export class StickyBoxModule {}