import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExpenseClaimsQuery, TransactionsQuery } from '../../../shared/generated-types';
import { AutoRefetchQueryRef } from '../../../shared/services/abstract-model.service';
import { AppDataSource } from '../../../shared/services/data.source';
import { UserService } from '../../../admin/users/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { ExpenseClaimService } from '../../../admin/expenseClaim/services/expenseClaim.service';
import { TransactionService } from '../../../admin/transactions/services/transaction.service';
import { AccountService } from '../../../admin/accounts/services/account.service';
import { MatDialog } from '@angular/material';
import { CreateRefundComponent } from '../create-refund/create-refund.component';
import { AlertService } from '../../../shared/components/alert/alert.service';

@Component({
    selector: 'app-finances',
    templateUrl: './finances.component.html',
    styleUrls: ['./finances.component.scss'],
})
export class FinancesComponent implements OnInit, OnDestroy {

    public user;

    public runningExpenseClaimsDS: AppDataSource;
    public runningExpenseClaimsQuery: AutoRefetchQueryRef<ExpenseClaimsQuery['expenseClaims']>;
    public expenseClaimsColumns = ['name', 'type', 'status', 'amount', 'cancel'];

    public transactionsDS: AppDataSource;
    public transactionsQuery: AutoRefetchQueryRef<TransactionsQuery['transactions']>;
    public transactionsColumns = ['name', 'amount'];

    constructor(
        private userService: UserService,
        private route: ActivatedRoute,
        private expenseClaimService: ExpenseClaimService,
        private transactionService: TransactionService,
        public accountService: AccountService,
        private alertService: AlertService,
        private dialog: MatDialog) {
    }

    ngOnInit() {
        this.user = this.route.snapshot.data.user.model;

        this.runningExpenseClaimsQuery = this.expenseClaimService.getForUser(this.user);
        this.runningExpenseClaimsDS = new AppDataSource(this.runningExpenseClaimsQuery.valueChanges);

        this.transactionsQuery = this.transactionService.getForUser(this.user);
        this.transactionsDS = new AppDataSource(this.transactionsQuery.valueChanges);
    }

    ngOnDestroy() {
        this.runningExpenseClaimsQuery.unsubscribe();
        this.transactionsQuery.unsubscribe();
    }

    public cancelExpenseClaim(expenseClaim) {

    }

    public canCancelExpenseClaim(expenseClaim) {
        return true;
    }

    public unlockIBAN() {
        // const iban = this.form.get('iban');
        //
        // if (iban) {
        //     iban.enable();
        // }
    }

    public createRefund() {

        this.dialog.open(CreateRefundComponent).afterClosed().subscribe(expense => {
            if (expense) {
                expense.amount *= -1; // refund != ExpenseClaim
                this.expenseClaimService.create(expense).subscribe(result => {
                    this.alertService.info('Votre demande de remboursement a bien été enregistrée');
                });
            }
        });

    }

}
