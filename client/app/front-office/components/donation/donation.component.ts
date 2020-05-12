import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CurrencyService } from '../../../shared/services/currency.service';

@Component({
    selector: 'app-donation',
    templateUrl: './donation.component.html',
    styleUrls: ['./donation.component.scss'],
})
export class DonationComponent implements OnInit {

    public amount: number;

    constructor(public currencyService: CurrencyService, public dialogRef: MatDialogRef<any>) {
    }

    ngOnInit() {
    }

}
