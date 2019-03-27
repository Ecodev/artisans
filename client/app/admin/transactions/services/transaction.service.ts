import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AbstractModelService, FormValidators } from '../../../shared/services/abstract-model.service';
import {
    createTransactionMutation,
    transactionQuery,
    transactionsQuery,
    updateTransactionMutation,
} from './transaction.queries';
import {
    CreateTransactionMutation,
    CreateTransactionMutationVariables,
    TransactionInput,
    TransactionQuery,
    TransactionQueryVariables,
    TransactionsQuery,
    TransactionsQueryVariables,
} from '../../../shared/generated-types';
import { Validators } from '@angular/forms';
import { Literal } from '../../../shared/types';

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
            updateTransactionMutation,
            null);
    }

    public getEmptyObject(): TransactionInput {
        return {
            name: '',
            remarks: '',
            internalRemarks: '',
            transactionDate: '',
            expenseClaim: null,
        };
    }

    public getFormValidators(): FormValidators {
        return {
            name: [Validators.required, Validators.maxLength(100)],
        };
    }

    protected getContextForUpdate(object): Literal {
        return {lines: object.transactionLines};
    }

    protected getContextForCreation(object): Literal {
        return {lines: object.transactionLines};
    }

}
