import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AbstractModelService, FormValidators } from '../../../shared/services/abstract-model.service';
import {
    createTransactionMutation,
    deleteTransactionsMutation,
    transactionQuery,
    transactionsQuery,
    updateTransactionMutation,
} from './transaction.queries';
import {
    CreateTransactionMutation,
    CreateTransactionMutationVariables,
    DeleteTransactionsMutation,
    TransactionInput,
    TransactionQuery,
    TransactionQueryVariables,
    TransactionsQuery,
    TransactionsQueryVariables,
    UpdateTransactionMutation,
    UpdateTransactionMutationVariables,
} from '../../../shared/generated-types';
import { Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class TransactionService extends AbstractModelService<TransactionQuery['transaction'],
    TransactionQueryVariables,
    TransactionsQuery['transactions'],
    TransactionsQueryVariables,
    CreateTransactionMutation['createTransaction'],
    CreateTransactionMutationVariables,
    UpdateTransactionMutation['updateTransaction'],
    UpdateTransactionMutationVariables,
    DeleteTransactionsMutation> {

    constructor(apollo: Apollo) {
        super(apollo,
            'transaction',
            transactionQuery,
            transactionsQuery,
            createTransactionMutation,
            updateTransactionMutation,
            deleteTransactionsMutation);
    }

    public getEmptyObject(): TransactionInput {
        return {
            name: '',
            expenseClaim: null,
            amount: 0,
            account: '',
            transactionDate: '',
            internalRemarks: '',
            remarks: '',
            category: null,
            bookable: null
        };
    }

    public getFormValidators(): FormValidators {
        return {
            name: [Validators.required, Validators.maxLength(100)],
            account: [Validators.required],
        };
    }

}
