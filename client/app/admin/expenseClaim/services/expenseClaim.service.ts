import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AbstractModelService, AutoRefetchQueryRef, FormValidators } from '../../../shared/services/abstract-model.service';
import {
    createExpenseClaimMutation,
    deleteExpenseClaimsMutation,
    expenseClaimQuery,
    expenseClaimsQuery,
    updateExpenseClaimMutation,
} from './expenseClaim.queries';
import {
    BookingsQueryVariables,
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
import { QueryVariablesManager } from '../../../shared/classes/query-variables-manager';

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
            owner: null,
            amount: '0',
            description: '',
            remarks: '',
            status: ExpenseClaimStatus.new,
        };
    }

    public getFormValidators(): FormValidators {
        return {
            name: [Validators.required, Validators.maxLength(100)],
            amount: [Validators.min(0)],
        };
    }

    public getForUser(user): AutoRefetchQueryRef<ExpenseClaimsQuery['expenseClaims']> {
        const variables: ExpenseClaimsQueryVariables = {
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

        const qvm = new QueryVariablesManager<ExpenseClaimsQueryVariables>();
        qvm.set('variables', variables);
        return this.watchAll(qvm, true);
    }

}
