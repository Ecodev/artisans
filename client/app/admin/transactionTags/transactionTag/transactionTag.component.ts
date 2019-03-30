import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractDetail } from '../../shared/components/AbstractDetail';
import { AlertService } from '../../../shared/components/alert/alert.service';
import {
    TransactionTag,
    TransactionTagVariables,
    CreateTransactionTag,
    CreateTransactionTagVariables,
    DeleteTransactionTags,
    UpdateTransactionTag,
    UpdateTransactionTagVariables,
} from '../../../shared/generated-types';
import { TransactionTagService } from '../services/transactionTag.service';

@Component({
    selector: 'app-transaction-tag',
    templateUrl: './transactionTag.component.html',
    styleUrls: ['./transactionTag.component.scss'],
})
export class TransactionTagComponent
    extends AbstractDetail<TransactionTag['transactionTag'],
        TransactionTagVariables,
        CreateTransactionTag['createTransactionTag'],
        CreateTransactionTagVariables,
        UpdateTransactionTag['updateTransactionTag'],
        UpdateTransactionTagVariables,
        DeleteTransactionTags> {


    constructor(alertService: AlertService,
                transactionTagService: TransactionTagService,
                router: Router,
                route: ActivatedRoute,
    ) {
        super('transactionTag', transactionTagService, alertService, router, route);
    }
}
