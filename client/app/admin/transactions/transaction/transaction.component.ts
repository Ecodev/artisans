import { Component, ViewChild } from '@angular/core';
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
import { EditableTransactionLinesComponent } from '../editable-transaction-lines/editable-transaction-lines.component';
import { TransactionLineService } from '../services/transactionLine.service';

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

    @ViewChild(EditableTransactionLinesComponent) transactionLinesComponent: EditableTransactionLinesComponent;

    public editTransactions = false;

    constructor(alertService: AlertService,
                transactionService: TransactionService,
                router: Router,
                route: ActivatedRoute,
                public accountService: AccountService,
                public bookableService: BookableService,
                public transactionLineService: TransactionLineService,
    ) {
        super('transaction', transactionService, alertService, router, route);
    }

    public save() {
        this.data.model.transactionLines = this.transactionLinesComponent.getList().map(line => this.transactionLineService.getInput(line));

        this.transactionLinesComponent.validateForm();

        if (!this.transactionLinesComponent.form.valid) {
            return;
        }

        if (this.data.model.id) {
            this.update(true);
        } else {
            this.create();
        }

    }
}
