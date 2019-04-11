import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppDataSource } from '../../../shared/services/data.source';
import { UserService } from '../../../admin/users/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { ExpenseClaimService } from '../../../admin/expenseClaim/services/expenseClaim.service';
import { TransactionLineService } from '../../../admin/transactions/services/transactionLine.service';
import { AbstractController } from '../../../shared/components/AbstractController';

@Component({
    selector: 'app-transaction-lines',
    templateUrl: './transaction-lines.component.html',
    styleUrls: ['./transaction-lines.component.scss'],
})
export class TransactionLinesComponent extends AbstractController implements OnInit, OnDestroy {

    public viewer;

    public transactionLinesDS: AppDataSource;
    public transactionsColumns = ['name', 'bookable', 'transactionDate', 'remarks', 'amount'];

    public ibanLocked = true;

    constructor(
        private userService: UserService,
        private route: ActivatedRoute,
        private expenseClaimService: ExpenseClaimService,
        private transactionLineService: TransactionLineService) {
        super();
    }

    ngOnInit() {
        this.viewer = this.route.snapshot.data.viewer.model;

        this.ibanLocked = !!this.viewer.iban;

        if (this.viewer.account) {
            const transactionLinesQuery = this.transactionLineService.getForAccount(this.viewer.account, this.ngUnsubscribe);
            this.transactionLinesDS = new AppDataSource(transactionLinesQuery);
        }
    }

}
