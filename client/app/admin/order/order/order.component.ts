import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NaturalDialogTriggerProvidedData } from '@ecodev/natural';
import { OrderLinesVariables } from '../../../shared/generated-types';

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {

    public contextVariables: OrderLinesVariables;

    public data;

    constructor(@Optional() @Inject(MAT_DIALOG_DATA) public dialogData: NaturalDialogTriggerProvidedData) {

        this.data = dialogData.activatedRoute.snapshot.data.order;

        this.contextVariables = {
            filter: {groups: [{conditions: [{order: {equal: {value: this.data.model.id}}}]}]},
        };

    }

    public ngOnInit(): void {
    }

}
