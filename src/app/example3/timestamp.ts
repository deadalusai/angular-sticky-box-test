import { Component } from "@angular/core";

@Component({
    selector: 'sb-timestamp',
    template: `{{ time }}`
})
export class TimestampComponent {
    time = new Date().getTime();
}