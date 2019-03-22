import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AbstractModelService, FormValidators } from '../../../shared/services/abstract-model.service';
import {
    createTransactionMutation,
    transactionQuery,
    transactionsQuery,
} from './transaction.queries';
import {
    CreateTransactionMutation,
    CreateTransactionMutationVariables,
    TransactionInput,
    TransactionQuery,
    TransactionQueryVariables,
    TransactionsQuery,
    TransactionsQueryVariables,
    UserQuery,
} from '../../../shared/generated-types';
import { Validators } from '@angular/forms';
import { QueryVariablesManager } from '../../../shared/classes/query-variables-manager';

@Injectable({
    providedIn: 'root',
})
export class TransactionService extends AbstractModelService<TransactionQuery['transaction'],
    TransactionQueryVariables,
    TransactionsQuery['transactions'],
    TransactionsQueryVariables,
    CreateTransactionMutation['createTransaction'],
    CreateTransactionMutationVariables,
    null,
    any,
    null> {

    constructor(apollo: Apollo) {
        super(apollo,
            'transaction',
            transactionQuery,
            transactionsQuery,
            createTransactionMutation,
            null,
            null);
    }

    public getEmptyObject(): TransactionInput {
        return {
            name: '',
            expenseClaim: null,
            transactionDate: '',
            internalRemarks: '',
            remarks: '',
        };
    }

    public getFormValidators(): FormValidators {
        return {
            name: [Validators.required, Validators.maxLength(100)],
            account: [Validators.required],
        };
    }

    public getForUser(user: UserQuery['user']) {
        const variables: TransactionsQueryVariables = {
            filter: {groups: [{conditions: [{owner: {in: {values: [user.id]}}}]}]},
        };

        const qvm = new QueryVariablesManager<TransactionsQueryVariables>();
        qvm.set('variables', variables);
        return this.watchAll(qvm);
    }

}
