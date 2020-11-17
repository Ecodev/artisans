import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CurrencyService} from '../../../shared/services/currency.service';
import {FormControl, Validators} from '@angular/forms';
import {money} from '@ecodev/natural';

export type DonationData = {
    amount: number | null;
};

@Component({
    selector: 'app-donation',
    templateUrl: './donation.component.html',
    styleUrls: ['./donation.component.scss'],
})
export class DonationComponent implements OnInit {
    public amount = new FormControl(null, [Validators.required, Validators.min(0), money]);

    constructor(
        @Inject(MAT_DIALOG_DATA) dialogData: DonationData,
        public currencyService: CurrencyService,
        public dialogRef: MatDialogRef<any>,
    ) {
        this.amount.setValue(dialogData.amount);
    }

    public ngOnInit(): void {}
}
