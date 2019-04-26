import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DialogTriggerProvidedData } from '../../shared/components/modal-trigger/dialog-trigger.component';
import { OrderLinesVariables } from '../../shared/generated-types';

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {

    public selectedColumns = ['name', 'remarks', 'balance'];

    public transaction;
    public contextVariables;

    public data;

    constructor(@Inject(MAT_DIALOG_DATA) public dialogData: DialogTriggerProvidedData) {

        this.data = dialogData.activatedRoute.snapshot.data.order;

        this.contextVariables = {
            filter: {groups: [{conditions: [{order: {equal: {value: this.data.model.id}}}]}]},
        } as OrderLinesVariables;

    }

    ngOnInit(): void {
    }

}
