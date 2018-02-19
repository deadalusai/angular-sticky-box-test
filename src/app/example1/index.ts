import { Component, NgModule } from "@angular/core";
import { StickyModule } from "../sticky";
import { TimestampComponent } from "./timestamp";
import { CommonModule } from "@angular/common";

@Component({
    templateUrl: './template.html'
})
export class Example1Component {
    show1 = false;
    show2 = false;
    // timeout = setInterval(() => this.show2 = !this.show2, 5000);
}

@NgModule({
    imports: [
        CommonModule,
        StickyModule
    ],
    declarations: [
        TimestampComponent,
        Example1Component
    ],
    exports: [
        Example1Component
    ]
})
export class Example1Module { }