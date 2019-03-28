import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    ExpenseClaimsQuery,
    ExpenseClaimStatus,
    ExpenseClaimType,
    TransactionLinesQuery,
} from '../../../shared/generated-types';
import { AutoRefetchQueryRef } from '../../../shared/services/abstract-model.service';
import { AppDataSource } from '../../../shared/services/data.source';
import { UserService } from '../../../admin/users/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { ExpenseClaimService } from '../../../admin/expenseClaim/services/expenseClaim.service';
import { MatDialog } from '@angular/material';
import { CreateRefundComponent } from '../create-refund/create-refund.component';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { TransactionLineService } from '../../../admin/transactions/services/transactionLine.service';

@Component({
    selector: 'app-finances',
    templateUrl: './finances.component.html',
    styleUrls: ['./finances.component.scss'],
})
export class FinancesComponent implements OnInit, OnDestroy {

    public user;

    public runningExpenseClaimsDS: AppDataSource;
    public runningExpenseClaimsQuery: AutoRefetchQueryRef<ExpenseClaimsQuery['expenseClaims']>;
    public expenseClaimsColumns = ['name', 'date', 'status', 'type', 'amount', 'cancel'];

    public transactionLinesDS: AppDataSource;
    public transactionLinesQuery: AutoRefetchQueryRef<TransactionLinesQuery['transactionLines']>;
    public transactionsColumns = ['name', 'transactionDate', 'amount'];

    public lockIban = true;

    constructor(
        private userService: UserService,
        private route: ActivatedRoute,
        private expenseClaimService: ExpenseClaimService,
        private transactionLineService: TransactionLineService,
        private alertService: AlertService,
        private dialog: MatDialog) {
    }

    ngOnInit() {
        this.user = this.route.snapshot.data.user.model;

        this.runningExpenseClaimsQuery = this.expenseClaimService.getForUser(this.user);
        this.runningExpenseClaimsDS = new AppDataSource(this.runningExpenseClaimsQuery.valueChanges);

        this.transactionLinesQuery = this.transactionLineService.getForUser(this.user);
        this.transactionLinesDS = new AppDataSource(this.transactionLinesQuery.valueChanges);
    }

    ngOnDestroy() {
        this.runningExpenseClaimsQuery.unsubscribe();
        this.transactionLinesQuery.unsubscribe();
    }

    public cancelExpenseClaim(expenseClaim) {
        if (this.canCancelExpenseClaim(expenseClaim)) {
            this.expenseClaimService.delete([expenseClaim]).subscribe();
        }
    }

    public canCancelExpenseClaim(expenseClaim) {
        return expenseClaim.status === ExpenseClaimStatus.new;
    }

    public createRefund() {

        this.dialog.open(CreateRefundComponent).afterClosed().subscribe(expense => {
            if (expense) {
                expense.type = ExpenseClaimType.refund;
                this.expenseClaimService.create(expense).subscribe(result => {
                    this.alertService.info('Votre demande de remboursement a bien été enregistrée');
                });
            }
        });

    }

    public updateIban() {
        this.userService.updatePartially({id: this.user.id, iban: this.user.iban}).subscribe(user => {
            this.alertService.info('Votre IBAN a été modifié');
        });
    }

}
