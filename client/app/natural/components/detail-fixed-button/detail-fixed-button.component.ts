import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'natural-detail-fixed-button',
    templateUrl: './detail-fixed-button.component.html',
    styleUrls: ['./detail-fixed-button.component.scss'],
})
export class NaturalDetailFixedButtonComponent implements OnInit {

    @Input() model;
    @Input() form;

    @Output() create = new EventEmitter();
    @Output() delete = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }

}
