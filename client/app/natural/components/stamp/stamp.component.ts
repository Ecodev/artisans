import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-stamp',
    templateUrl: './stamp.component.html',
})
export class StampComponent {
    @Input() item;
}
