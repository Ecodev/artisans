import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractDetail } from '../../shared/components/AbstractDetail';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { ExpenseClaimService } from '../services/expenseClaim.service';
import {
    CreateExpenseClaimMutation,
    CreateExpenseClaimMutationVariables,
    ExpenseClaimQuery,
    ExpenseClaimQueryVariables,
    UpdateExpenseClaimMutation,
    UpdateExpenseClaimMutationVariables,
} from '../../../shared/generated-types';
import { UserService } from '../../users/services/user.service';

@Component({
    selector: 'app-expense-claim',
    templateUrl: './expenseClaim.component.html',
    styleUrls: ['./expenseClaim.component.scss'],
})
export class ExpenseClaimComponent
    extends AbstractDetail<ExpenseClaimQuery['expenseClaim'],
        ExpenseClaimQueryVariables,
        CreateExpenseClaimMutation['createExpenseClaim'],
        CreateExpenseClaimMutationVariables,
        UpdateExpenseClaimMutation['updateExpenseClaim'],
        UpdateExpenseClaimMutationVariables,
        any> {

    constructor(alertService: AlertService,
                expenseClaimService: ExpenseClaimService,
                router: Router,
                route: ActivatedRoute,
                public userService: UserService,
    ) {
        super('expenseClaim', expenseClaimService, alertService, router, route);
    }
}
