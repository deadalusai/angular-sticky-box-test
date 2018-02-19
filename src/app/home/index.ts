import { Component, NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PortalModule } from "@angular/cdk/portal";

@Component({
    templateUrl: './template.html'
})
export class HomeComponent {

}

@NgModule({
    imports: [
        RouterModule
    ],
    declarations: [
        HomeComponent
    ],
    exports: [
        HomeComponent
    ]
})
export class HomeModule { }