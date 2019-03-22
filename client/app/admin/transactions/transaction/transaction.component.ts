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
} from '../../../shared/generated-types';
import { AccountService } from '../../accounts/services/account.service';
import { BookableService } from '../../bookables/services/bookable.service';
import { TransactionTagService } from '../../transactionTags/services/transactionTag.service';

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
        null,
        any,
        any> {

    constructor(alertService: AlertService,
                transactionService: TransactionService,
                router: Router,
                route: ActivatedRoute,
                public accountService: AccountService,
                public bookableService: BookableService,
                public transactionTagService: TransactionTagService
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
