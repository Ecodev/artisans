import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAbstractController } from '@ecodev/natural';
import { ExpenseClaimService } from '../../../admin/expenseClaim/services/expenseClaim.service';
import { TransactionService } from '../../../admin/transactions/services/transaction.service';
import { UserService } from '../../../admin/users/services/user.service';
import { TransactionsVariables } from '../../../shared/generated-types';

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss'],
})
export class HistoryComponent extends NaturalAbstractController implements OnInit, OnChanges, OnDestroy {

    @Input() user;

    public transactionVariables: TransactionsVariables;

    constructor(
        private userService: UserService,
        private route: ActivatedRoute,
        private expenseClaimService: ExpenseClaimService,
        private transactionService: TransactionService,
        private router: Router,
    ) {
        super();
    }

    ngOnInit() {

        if (!this.user) {
            this.user = this.route.snapshot.data.viewer.model;
        }
        // else {
        //     this.adminMode = true;
        // }

        this.loadData();

    }

    ngOnChanges(changes: SimpleChanges) {
        const currentUser = changes.user.currentValue;
        if (currentUser.id !== this.user.id) {
            this.loadData();
        }
    }

    public loadData() {

        if (this.user.account) {
            this.transactionVariables = TransactionService.getVariablesForAccount(this.user.account);
        }
    }

    public detail(transaction) {
        this.router.navigate(['.', transaction.id], {relativeTo: this.route});
    }

}
