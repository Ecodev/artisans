import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExpenseClaims, ExpenseClaimStatus, ExpenseClaimType, TransactionLines } from '../../../shared/generated-types';
import { AutoRefetchQueryRef } from '../../../shared/services/abstract-model.service';
import { AppDataSource } from '../../../shared/services/data.source';
import { UserService } from '../../../admin/users/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { ExpenseClaimService } from '../../../admin/expenseClaim/services/expenseClaim.service';
import { MatDialog } from '@angular/material';
import { CreateRefundComponent } from '../create-refund/create-refund.component';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { TransactionLineService } from '../../../admin/transactions/services/transactionLine.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
    selector: 'app-finances',
    templateUrl: './finances.component.html',
    styleUrls: ['./finances.component.scss'],
})
export class FinancesComponent implements OnInit, OnDestroy {

    public user;

    public runningExpenseClaimsDS: AppDataSource;
    public runningExpenseClaims: AutoRefetchQueryRef<ExpenseClaims['expenseClaims']>;
    public expenseClaimsColumns = ['name', 'date', 'status', 'type', 'amount', 'cancel'];

    public transactionLinesDS: AppDataSource;
    public transactionLinesQuery: AutoRefetchQueryRef<TransactionLines['transactionLines']>;
    public transactionsColumns = ['name', 'transactionDate', 'amount'];

    public ibanLocked = true;

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

        this.ibanLocked = !!this.user.iban;

        this.runningExpenseClaims = this.expenseClaimService.getForUser(this.user);
        this.runningExpenseClaimsDS = new AppDataSource(this.runningExpenseClaims.valueChanges);

        this.transactionLinesQuery = this.transactionLineService.getForUser(this.user);
        this.transactionLinesDS = new AppDataSource(this.transactionLinesQuery.valueChanges);
    }

    ngOnDestroy() {
        this.runningExpenseClaims.unsubscribe();
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

        const config = {
            data: {
                confirmText: 'Envoyer la demande',
            },
        };
        this.dialog.open(CreateRefundComponent, config).afterClosed().subscribe(expense => {
            if (expense) {
                expense.type = ExpenseClaimType.refund;
                this.expenseClaimService.create(expense).subscribe(result => {
                    this.alertService.info('Votre demande de remboursement a bien été enregistrée');
                });
            }
        });

    }

    public updateIban(iban: string) {
        this.userService.updatePartially({id: this.user.id, iban: iban}).pipe(catchError(() => {
            this.alertService.error('L\'IBAN est invalide');
            return of(null);
        })).subscribe(user => {
            if (user) {
                this.ibanLocked = true;
                this.alertService.info('Votre IBAN a été modifié');
                this.user.iban = iban;
                this.lockIbanIfDefined();
            } else {
                this.ibanLocked = false;
            }
        });
    }

    public lockIbanIfDefined() {
        if (this.user.iban) {
            this.ibanLocked = true;
        }
    }

}
