import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { OrderLinesVariables } from '../../shared/generated-types';

@Component({
    selector: 'app-order-detail',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {

    public selectedColumns = ['name', 'remarks', 'balance'];

    public transaction;
    public contextVariables;

    public data;

    constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any) {

        this.data = dialogData.routeSnapshot.data.order;

        this.contextVariables = {
            filter: {groups: [{conditions: [{order: {equal: {value: this.data.model.id}}}]}]},
        } as OrderLinesVariables;

    }

    ngOnInit(): void {
    }

}
