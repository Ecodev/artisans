import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAbstractDetail } from '../../../natural/classes/abstract-detail';
import { NaturalAlertService } from '../../../natural/components/alert/alert.service';
import { ExpenseClaimService } from '../services/expenseClaim.service';
import {
    CreateExpenseClaim,
    CreateExpenseClaimVariables,
    ExpenseClaim,
    ExpenseClaimType,
    ExpenseClaimVariables,
    UpdateExpenseClaim,
    UpdateExpenseClaimVariables,
} from '../../../shared/generated-types';
import { UserService } from '../../users/services/user.service';

@Component({
    selector: 'app-expense-claim',
    templateUrl: './expenseClaim.component.html',
    styleUrls: ['./expenseClaim.component.scss'],
})
export class ExpenseClaimComponent
    extends NaturalAbstractDetail<ExpenseClaim['expenseClaim'],
        ExpenseClaimVariables,
        CreateExpenseClaim['createExpenseClaim'],
        CreateExpenseClaimVariables,
        UpdateExpenseClaim['updateExpenseClaim'],
        UpdateExpenseClaimVariables,
        any> {

    public ExpenseClaimType = ExpenseClaimType;

    constructor(alertService: NaturalAlertService,
                expenseClaimService: ExpenseClaimService,
                router: Router,
                route: ActivatedRoute,
                public userService: UserService,
    ) {
        super('expenseClaim', expenseClaimService, alertService, router, route);
    }
}
