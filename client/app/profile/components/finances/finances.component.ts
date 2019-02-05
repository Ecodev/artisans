import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExpenseClaimsQuery, TransactionsQuery } from '../../../shared/generated-types';
import { AutoRefetchQueryRef } from '../../../shared/services/abstract-model.service';
import { AppDataSource } from '../../../shared/services/data.source';
import { UserService } from '../../../admin/users/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { ExpenseClaimService } from '../../../admin/expenseClaim/services/expenseClaim.service';
import { TransactionService } from '../../../admin/transactions/services/transaction.service';
import { AccountService } from '../../../admin/accounts/services/account.service';
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
    public expenseClaimsColumns = ['name', 'description', 'amount', 'cancel'];

    public transactionsDS: AppDataSource;
    public transactionsQuery: AutoRefetchQueryRef<TransactionsQuery['transactions']>;
    public transactionsColumns = ['name', 'amount'];

    constructor(
        private userService: UserService,
        private route: ActivatedRoute,
        private expenseClaimService: ExpenseClaimService,
        private transactionService: TransactionService,
        public accountService: AccountService,
        private alertService: AlertService) {
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

    /**
     * Manages account transparently just by setting the iban.
     * If no account exists when an iban is created, then the account is created for current user and setted iban
     * If account exists and iban changes, the account is updated
     * TODO : test after fixing server error
     */
    public updateOrCreateAccount() {
        // const iban = this.form.get('iban');
        // const account = this.form.get('account');
        //
        // const confirmAndLock = () => {
        //     this.alertService.info('Votre compte IBAN a été mis à jour');
        //
        //     if (iban) {
        //         iban.disable();
        //     }
        // };
        //
        // if (iban && iban.value && account && account.value) {
        //     const newAccount = {id: account.value.id, iban: iban.value};
        //     this.accountService.updateNow(newAccount).subscribe(confirmAndLock);
        // } else if (iban && iban.value && account && !account.value) {
        //     this.accountService.create({iban: iban.value, owner: this.data.model.id, name: 'User account'}).subscribe(confirmAndLock);
        // }
    }

    public unlockIBAN() {
        // const iban = this.form.get('iban');
        //
        // if (iban) {
        //     iban.enable();
        // }
    }

}
