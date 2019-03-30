import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AbstractModelService, FormValidators } from '../../../shared/services/abstract-model.service';
import {
    createTransaction,
    deleteTransactions,
    transactionQuery,
    transactionsQuery,
    updateTransaction,
} from './transaction.queries';
import {
    CreateTransaction,
    CreateTransactionVariables, DeleteTransactions,
    TransactionInput,
    Transaction,
    TransactionVariables,
    Transactions,
    TransactionsVariables,
    UpdateTransaction,
    UpdateTransactionVariables,
} from '../../../shared/generated-types';
import { Validators } from '@angular/forms';
import { Literal } from '../../../shared/types';

@Injectable({
    providedIn: 'root',
})
export class TransactionService extends AbstractModelService<Transaction['transaction'],
    TransactionVariables,
    Transactions['transactions'],
    TransactionsVariables,
    CreateTransaction['createTransaction'],
    CreateTransactionVariables,
    UpdateTransaction['updateTransaction'],
    UpdateTransactionVariables,
    DeleteTransactions> {

    constructor(apollo: Apollo) {
        super(apollo,
            'transaction',
            transactionQuery,
            transactionsQuery,
            createTransaction,
            updateTransaction,
            deleteTransactions);
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
