import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
    accountQuery,
    accountsQuery,
    createAccount,
    deleteAccounts,
    updateAccount,
} from './account.queries';
import {
    AccountInput,
    Account,
    AccountVariables,
    Accounts,
    AccountsVariables,
    AccountType,
    CreateAccount,
    CreateAccountVariables,
    DeleteAccounts,
    UpdateAccount,
    UpdateAccountVariables,
} from '../../../shared/generated-types';
import { Validators } from '@angular/forms';
import { NaturalAbstractModelService, FormValidators } from '@ecodev/natural';

@Injectable({
    providedIn: 'root',
})
export class AccountService extends NaturalAbstractModelService<Account['account'],
    AccountVariables,
    Accounts['accounts'],
    AccountsVariables,
    CreateAccount['createAccount'],
    CreateAccountVariables,
    UpdateAccount['updateAccount'],
    UpdateAccountVariables,
    DeleteAccounts> {

    constructor(apollo: Apollo) {
        super(apollo,
            'account',
            accountQuery,
            accountsQuery,
            createAccount,
            updateAccount,
            deleteAccounts);
    }

    protected getDefaultForServer(): AccountInput {
        return {
            name: '',
            iban: '',
            type: AccountType.expense,
            code: null,
            owner: null,
        };
    }

    public getFormValidators(): FormValidators {
        return {
            name: [Validators.required, Validators.maxLength(100)],
        };
    }

}
