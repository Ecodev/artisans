import { Component, Input, OnInit } from '@angular/core';
import Decimal from 'decimal.js';
import { mod10Recursive } from '../../../shared/utils';

@Component({
    selector: 'app-bvr',
    templateUrl: './bvr.component.html',
    styleUrls: ['./bvr.component.scss'],
})
export class BvrComponent implements OnInit {

    @Input() set bankingData(data) {
        this.amount = data.amount;
        this.fullReference = this.getFullReference(data.amount, this.bankingInfos.referenceNumber, this.bankingInfos.formattedBankAccount);
    }

    public bankingInfos = {
        referenceNumber: '800826000000000000000000012',
        bankAccount: '01-162-8',
        formattedBankAccount: '010001628',
    };

    public fullReference;
    public amount;

    constructor() {
        this.fullReference = this.getFullReference(this.amount, this.bankingInfos.referenceNumber, this.bankingInfos.formattedBankAccount);
    }

    ngOnInit() {
    }

    public getFullReference(amount, referenceNumber, bankAccount) {
        let cents = '042';

        if (amount) {
            cents = '01' + ('' + Decimal.mul(amount, 100)).padStart(10, '0');
        }

        const checkedAmount = cents + mod10Recursive(cents);
        return checkedAmount + '>' + referenceNumber + '+ ' + bankAccount + '>';
    }

}
