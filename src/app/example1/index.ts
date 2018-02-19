import { Component, NgModule } from "@angular/core";

@Component({
    templateUrl: './template.html'
})
export class Example1Component {

}

@NgModule({
    declarations: [
        Example1Component
    ],
    exports: [
        Example1Component
    ]
})
export class Example1Module { }