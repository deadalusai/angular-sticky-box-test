import { Component, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TimestampComponent } from "./timestamp";
import { TeleportModule } from "../teleport";

@Component({
    templateUrl: './template.html',
    styleUrls: ['./template.css']
})
export class Example3Component {
}

@NgModule({
    imports: [
        CommonModule,
        TeleportModule
    ],
    declarations: [
        TimestampComponent,
        Example3Component
    ],
    exports: [
        Example3Component
    ]
})
export class Example3Module { }
