import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractDetail } from '../../shared/components/AbstractDetail';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { TransactionService } from '../services/transaction.service';
import {
    CreateTransactionMutation,
    CreateTransactionMutationVariables,
    TransactionQuery,
    TransactionQueryVariables,
    UpdateTransactionMutation,
    UpdateTransactionMutationVariables,
} from '../../../shared/generated-types';
import { AccountService } from '../../accounts/services/account.service';
import { CategoryConfiguration } from '../../../shared/hierarchic-selector/configurations/CategoryConfiguration';
import { BookableService } from '../../bookables/services/bookable.service';

@Component({
    selector: 'app-transaction',
    templateUrl: './transaction.component.html',
    styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent
    extends AbstractDetail<TransactionQuery['transaction'],
        TransactionQueryVariables,
        CreateTransactionMutation['createTransaction'],
        CreateTransactionMutationVariables,
        UpdateTransactionMutation['updateTransaction'],
        UpdateTransactionMutationVariables,
        any> {

    public hierarchicConfig = CategoryConfiguration;

    constructor(alertService: AlertService,
                transactionService: TransactionService,
                router: Router,
                route: ActivatedRoute,
                public accountService: AccountService,
                public bookableService: BookableService
    ) {
        super('transaction', transactionService, alertService, router, route);
    }

    public showAccountName(item) {

        if (!item) {
            return '';
        }

        return item.owner ? item.owner.name : item.name || item;
    }
}
