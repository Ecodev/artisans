import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractDetail } from '../../shared/components/AbstractDetail';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { TransactionService } from '../services/transaction.service';
import {
    TransactionQuery,
    TransactionQueryVariables,
    CreateTransactionMutation,
    CreateTransactionMutationVariables,
    UpdateTransactionMutation,
    UpdateTransactionMutationVariables,
} from '../../../shared/generated-types';

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

    constructor(alertService: AlertService,
                transactionService: TransactionService,
                router: Router,
                route: ActivatedRoute,
    ) {
        super('transaction', transactionService, alertService, router, route);
    }
}
