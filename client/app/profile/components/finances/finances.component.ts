import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { ExpenseClaimStatus, ExpenseClaimType } from '../../../shared/generated-types';
import { UserService } from '../../../admin/users/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { ExpenseClaimService } from '../../../admin/expenseClaim/services/expenseClaim.service';
import { MatDialog } from '@angular/material';
import { CreateRefundComponent } from '../create-refund/create-refund.component';
import { AlertService } from '../../../natural/components/alert/alert.service';
import { TransactionLineService } from '../../../admin/transactions/services/transactionLine.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AbstractController } from '../../../shared/components/AbstractController';
import { NaturalDataSource } from '../../../natural/classes/DataSource';

@Component({
    selector: 'app-finances',
    templateUrl: './finances.component.html',
    styleUrls: ['./finances.component.scss'],
})
export class FinancesComponent extends AbstractController implements OnChanges, OnDestroy {

    @Input() user;

    public runningExpenseClaimsDS: NaturalDataSource;
    public expenseClaimsColumns = ['name', 'date', 'status', 'type', 'remarks', 'amount', 'cancel'];

    public ibanLocked = true;

    public adminMode = false;

    constructor(
        private userService: UserService,
        private route: ActivatedRoute,
        private expenseClaimService: ExpenseClaimService,
        private transactionLineService: TransactionLineService,
        private alertService: AlertService,
        private dialog: MatDialog) {
        super();
    }

    ngOnChanges(changes: SimpleChanges) {

        const currentUser = changes.user.currentValue;
        const previousUser = changes.user.previousValue;

        if (!previousUser || currentUser.id !== previousUser.id) {

            if (!this.user) {
                this.user = this.route.snapshot.data.viewer.model;
            } else {
                this.adminMode = true;
                this.expenseClaimsColumns.push('admin');
            }

            this.ibanLocked = !!this.user.iban;

            const runningExpenseClaims = this.expenseClaimService.getForUser(this.user, this.ngUnsubscribe);
            this.runningExpenseClaimsDS = new NaturalDataSource(runningExpenseClaims);
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
                this.expenseClaimService.create(expense).subscribe(() => {
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
