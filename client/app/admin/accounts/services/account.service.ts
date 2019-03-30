import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AbstractModelService, FormValidators } from '../../../shared/services/abstract-model.service';
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

@Injectable({
    providedIn: 'root',
})
export class AccountService extends AbstractModelService<Account['account'],
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

    public getEmptyObject(): AccountInput {
        return {
            name: '',
            iban: '',
            type: AccountType.expense,
            code: '',
            owner: null,
        };
    }

    public getFormValidators(): FormValidators {
        return {
            name: [Validators.required, Validators.maxLength(100)],
        };
    }

}
