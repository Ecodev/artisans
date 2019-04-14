import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-fixed-button',
    templateUrl: './fixed-button.component.html',
    styleUrls: ['./fixed-button.component.scss'],
})
export class FixedButtonComponent implements OnInit {

    @Input() link: string;
    @Input() icon: string;
    @Input() color = 'accent';
    @Input() disabled = false;

    constructor() {
    }

    ngOnInit() {
    }

}
