import { Component, NgModule } from "@angular/core";
import { TeleportModule } from "../teleport";
import { TimestampComponent } from "./timestamp";
import { CommonModule } from "@angular/common";

@Component({
    templateUrl: './template.html',
  styleUrls: ['./template.css']
})
export class Example1Component {
    show1 = false;
    show2 = false;
    aside1 = false;
}

@NgModule({
    imports: [
        CommonModule,
        TeleportModule
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
