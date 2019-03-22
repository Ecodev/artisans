import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractDetail } from '../../shared/components/AbstractDetail';
import { AlertService } from '../../../shared/components/alert/alert.service';
import {
    TransactionTagQuery,
    TransactionTagQueryVariables,
    CreateTransactionTagMutation,
    CreateTransactionTagMutationVariables,
    DeleteTransactionTagsMutation,
    UpdateTransactionTagMutation,
    UpdateTransactionTagMutationVariables,
} from '../../../shared/generated-types';
import { TransactionTagService } from '../services/transactionTag.service';

@Component({
    selector: 'app-transaction-tag',
    templateUrl: './transactionTag.component.html',
    styleUrls: ['./transactionTag.component.scss'],
})
export class TransactionTagComponent
    extends AbstractDetail<TransactionTagQuery['transactionTag'],
        TransactionTagQueryVariables,
        CreateTransactionTagMutation['createTransactionTag'],
        CreateTransactionTagMutationVariables,
        UpdateTransactionTagMutation['updateTransactionTag'],
        UpdateTransactionTagMutationVariables,
        DeleteTransactionTagsMutation> {


    constructor(alertService: AlertService,
                transactionTagService: TransactionTagService,
                router: Router,
                route: ActivatedRoute,
    ) {
        super('transactionTag', transactionTagService, alertService, router, route);
    }
}
