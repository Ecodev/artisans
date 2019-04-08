import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AbstractModelService, FormValidators } from '../../../shared/services/abstract-model.service';
import {
    createExpenseClaim,
    deleteExpenseClaims,
    expenseClaimQuery,
    expenseClaimsQuery,
    updateExpenseClaim,
} from './expenseClaim.queries';
import {
    CreateExpenseClaim,
    CreateExpenseClaimVariables,
    DeleteExpenseClaims,
    ExpenseClaim,
    ExpenseClaimInput,
    ExpenseClaims,
    ExpenseClaimStatus,
    ExpenseClaimsVariables,
    ExpenseClaimType,
    ExpenseClaimVariables,
    UpdateExpenseClaim,
    UpdateExpenseClaimVariables,
} from '../../../shared/generated-types';
import { Validators } from '@angular/forms';
import { QueryVariablesManager } from '../../../shared/classes/query-variables-manager';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ExpenseClaimService extends AbstractModelService<ExpenseClaim['expenseClaim'],
    ExpenseClaimVariables,
    ExpenseClaims['expenseClaims'],
    ExpenseClaimsVariables,
    CreateExpenseClaim['createExpenseClaim'],
    CreateExpenseClaimVariables,
    UpdateExpenseClaim['updateExpenseClaim'],
    UpdateExpenseClaimVariables,
    DeleteExpenseClaims> {

    constructor(apollo: Apollo) {
        super(apollo,
            'expenseClaim',
            expenseClaimQuery,
            expenseClaimsQuery,
            createExpenseClaim,
            updateExpenseClaim,
            deleteExpenseClaims);
    }

    public getEmptyObject(): ExpenseClaimInput {
        return {
            name: '',
            owner: null,
            amount: '0',
            description: '',
            remarks: '',
            internalRemarks: '',
            status: ExpenseClaimStatus.new,
            type: ExpenseClaimType.expenseClaim,
        };
    }

    public getFormValidators(): FormValidators {
        return {
            name: [Validators.required, Validators.maxLength(100)],
            amount: [Validators.min(0)],
        };
    }

    public getForUser(user, expire: Subject<void>): Observable<ExpenseClaims['expenseClaims']> {
        const variables: ExpenseClaimsVariables = {
            filter: {
                groups: [
                    {
                        conditions: [
                            {
                                owner: {equal: {value: user.id}},
                                // status: {equal: {value: BookingStatus.application}}, ?? all ? or just pending ones ?
                            },
                        ],
                    },
                ],
            },
        };

        const qvm = new QueryVariablesManager<ExpenseClaimsVariables>();
        qvm.set('variables', variables);
        return this.watchAll(qvm, expire);
    }

}
