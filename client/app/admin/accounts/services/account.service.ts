import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AbstractModelService, FormValidators } from '../../../shared/services/abstract-model.service';
import { accountQuery, accountsQuery, createAccountMutation, deleteAccountsMutation, updateAccountMutation } from './account.queries';
import {
    AccountInput,
    AccountQuery,
    AccountQueryVariables,
    AccountsQuery,
    AccountsQueryVariables,
    CreateAccountMutation,
    CreateAccountMutationVariables,
    DeleteAccountsMutation,
    UpdateAccountMutation,
    UpdateAccountMutationVariables,
} from '../../../shared/generated-types';
import { Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class AccountService extends AbstractModelService<AccountQuery['account'],
    AccountQueryVariables,
    AccountsQuery['accounts'],
    AccountsQueryVariables,
    CreateAccountMutation['createAccount'],
    CreateAccountMutationVariables,
    UpdateAccountMutation['updateAccount'],
    UpdateAccountMutationVariables,
    DeleteAccountsMutation> {

    constructor(apollo: Apollo) {
        super(apollo,
            'account',
            accountQuery,
            accountsQuery,
            createAccountMutation,
            updateAccountMutation,
            deleteAccountsMutation);
    }

    public getEmptyObject(): AccountInput {
        return {
            name: '',
            iban: '',
        };
    }

    public getFormValidators(): FormValidators {
        return {
            name: [Validators.required, Validators.maxLength(100)],
            iban: [Validators.required],
        };
    }

}
