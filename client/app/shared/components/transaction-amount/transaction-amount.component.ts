import { Component, HostBinding, Input, OnChanges, OnInit } from '@angular/core';
import { AccountQuery, AccountType, TransactionLineQuery } from '../../generated-types';

@Component({
    selector: 'app-transaction-amount',
    templateUrl: './transaction-amount.component.html',
    styleUrls: ['./transaction-amount.component.scss'],
})
export class TransactionAmountComponent implements OnInit, OnChanges {

    @Input() transactionLine: TransactionLineQuery['transactionLine'];

    /**
     * Account we want to see the amount relative to
     */
    @Input() relativeToAccount: AccountQuery['account'];
    @Input() displayMode: 'amount' | 'account' = 'amount';

    public isIncome: boolean | null = null;

    constructor() {
    }

    ngOnInit() {
    }

    ngOnChanges() {
        const account = this.relativeToAccount;
        const transaction = this.transactionLine;
        if (account && transaction) {
            if (transaction.debit && account.id === transaction.debit.id) { // If account is at transaction debit
                this.isIncome = [AccountType.asset, AccountType.expense].indexOf(account.type) > -1;
            } else if (transaction.credit && account.id === transaction.credit.id) { // If account is at transaction credit
                this.isIncome = [AccountType.liability, AccountType.equity, AccountType.revenue].indexOf(account.type) > -1;
            } else {
                this.isIncome = null;
            }
        }
    }

}
