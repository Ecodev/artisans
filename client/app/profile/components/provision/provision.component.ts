import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, ShowOnDirtyErrorStateMatcher } from '@angular/material';
import { BankingInfosVariables } from '../../../shared/generated-types';

@Component({
    selector: 'app-provision',
    templateUrl: './provision.component.html',
    styleUrls: ['./provision.component.scss'],
})
export class ProvisionComponent implements OnInit {

    public min = 25;
    public defaultValue = this.min;
    public formCtrl: FormControl;
    public matcher = new ShowOnDirtyErrorStateMatcher();
    public bvrData: BankingInfosVariables;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {

        if (data.balance < 0) {
            this.min = Math.abs(data.balance);
        }

        this.formCtrl = new FormControl(Math.max(this.min, this.defaultValue), [Validators.min(this.min)]);

        const updateBrvData = (amount) => {
            this.bvrData = {
                user: data.user.id,
                amount: amount,
            };
        };

        this.formCtrl.valueChanges.subscribe(amount => updateBrvData(amount));
        updateBrvData(this.formCtrl.value);
    }

    ngOnInit() {
    }

}
