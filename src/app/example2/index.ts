import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TeleportModule } from "../teleport";
import { StickyBoxModule } from "../sticky-box";

@Component({
    templateUrl: './template.html',
    styleUrls: ['./template.css']
})
export class Example2Component {
    show1 = false;
    show2 = false;
    aside1 = false;
}

@NgModule({
    imports: [
        CommonModule,
        TeleportModule,
        StickyBoxModule
    ],
    declarations: [
        Example2Component
    ],
    exports: [
        Example2Component
    ]
})
export class Example2Module { }
