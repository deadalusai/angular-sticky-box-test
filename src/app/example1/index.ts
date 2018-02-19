import { Component, NgModule } from "@angular/core";
import { StickyModule } from "../sticky";

@Component({
    templateUrl: './template.html'
})
export class Example1Component {

}

@NgModule({
    imports: [
        StickyModule
    ],
    declarations: [
        Example1Component
    ],
    exports: [
        Example1Component
    ]
})
export class Example1Module { }