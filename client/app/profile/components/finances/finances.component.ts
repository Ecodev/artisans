import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExpenseClaimStatus, ExpenseClaimType } from '../../../shared/generated-types';
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
import { AbstractController } from '../../../shared/components/AbstractController';

@Component({
    selector: 'app-finances',
    templateUrl: './finances.component.html',
    styleUrls: ['./finances.component.scss'],
})
export class FinancesComponent extends AbstractController implements OnInit, OnDestroy {

    public user;

    public runningExpenseClaimsDS: AppDataSource;
    public expenseClaimsColumns = ['name', 'date', 'status', 'type', 'remarks', 'amount', 'cancel'];

    public transactionLinesDS: AppDataSource;
    public transactionsColumns = ['name', 'transactionDate', 'remarks', 'amount'];

    public ibanLocked = true;

    constructor(
        private userService: UserService,
        private route: ActivatedRoute,
        private expenseClaimService: ExpenseClaimService,
        private transactionLineService: TransactionLineService,
        private alertService: AlertService,
        private dialog: MatDialog) {
        super();
    }

    ngOnInit() {
        this.user = this.route.snapshot.data.user.model;

        this.ibanLocked = !!this.user.iban;

        const runningExpenseClaims = this.expenseClaimService.getForUser(this.user, this.ngUnsubscribe);
        this.runningExpenseClaimsDS = new AppDataSource(runningExpenseClaims);

        if (this.user.account) {
            const transactionLinesQuery = this.transactionLineService.getForAccount(this.user.account, this.ngUnsubscribe);
            this.transactionLinesDS = new AppDataSource(transactionLinesQuery);
        }
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
