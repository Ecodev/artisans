import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AbstractModelService, FormValidators } from '../../../shared/services/abstract-model.service';
import {
    createExpenseClaimMutation,
    deleteExpenseClaimsMutation,
    expenseClaimQuery,
    expenseClaimsQuery,
    updateExpenseClaimMutation,
} from './expenseClaim.queries';
import {
    CreateExpenseClaimMutation,
    CreateExpenseClaimMutationVariables,
    DeleteExpenseClaimsMutation,
    ExpenseClaimInput,
    ExpenseClaimQuery,
    ExpenseClaimQueryVariables,
    ExpenseClaimsQuery,
    ExpenseClaimsQueryVariables,
    ExpenseClaimStatus,
    UpdateExpenseClaimMutation,
    UpdateExpenseClaimMutationVariables,
} from '../../../shared/generated-types';
import { Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class ExpenseClaimService extends AbstractModelService<ExpenseClaimQuery['expenseClaim'],
    ExpenseClaimQueryVariables,
    ExpenseClaimsQuery['expenseClaims'],
    ExpenseClaimsQueryVariables,
    CreateExpenseClaimMutation['createExpenseClaim'],
    CreateExpenseClaimMutationVariables,
    UpdateExpenseClaimMutation['updateExpenseClaim'],
    UpdateExpenseClaimMutationVariables,
    DeleteExpenseClaimsMutation> {

    constructor(apollo: Apollo) {
        super(apollo,
            'expenseClaim',
            expenseClaimQuery,
            expenseClaimsQuery,
            createExpenseClaimMutation,
            updateExpenseClaimMutation,
            deleteExpenseClaimsMutation);
    }

    public getEmptyObject(): ExpenseClaimInput {
        return {
            name: '',
            user: '',
            amount: 0,
            description: '',
            remarks: '',
            status: ExpenseClaimStatus.new,
        };
    }

    public getFormValidators(): FormValidators {
        return {
            name: [Validators.required, Validators.maxLength(100)],
        };
    }

}
