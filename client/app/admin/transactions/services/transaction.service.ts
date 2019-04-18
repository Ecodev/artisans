import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AbstractModelService, FormValidators } from '../../../natural/services/abstract-model.service';
import { createTransaction, deleteTransactions, transactionQuery, transactionsQuery, updateTransaction } from './transaction.queries';
import {
    CreateTransaction,
    CreateTransactionVariables,
    DeleteTransactions,
    Transaction,
    TransactionInput,
    TransactionLineInput,
    Transactions,
    TransactionsVariables,
    TransactionVariables,
    UpdateTransaction,
    UpdateTransactionVariables,
} from '../../../shared/generated-types';
import { Validators } from '@angular/forms';
import { TransactionLineService } from './transactionLine.service';
import { Literal } from '../../../natural/types/types';
import {TimezonePreservingDateAdapter} from '../../../shared/services/timezone.preserving.date.adapter';

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

    constructor(apollo: Apollo,
                private transactionLineService: TransactionLineService,
                private timezonePreservingDateAdapter: TimezonePreservingDateAdapter,
    ) {
        super(apollo,
            'transaction',
            transactionQuery,
            transactionsQuery,
            createTransaction,
            updateTransaction,
            deleteTransactions);
    }

    public getRefundPreset(account: {id: string}, amount: string): TransactionLineInput[] {

        const emptyLine = this.transactionLineService.getConsolidatedForClient();

        const line: TransactionLineInput = {
            name: 'Remboursement du membre',
            debit: account,
            credit: {id: '10025', name: 'Postfinance'},
            balance: amount,
            transactionDate: this.timezonePreservingDateAdapter.today(),
        };

        return [Object.assign(emptyLine, line)];
    }

    public getExpenseClaimPreset(account: {id: string}, amount: string): TransactionLineInput[] {

        const emptyLine = this.transactionLineService.getConsolidatedForClient();

        const line: TransactionLineInput = {
            name: 'Remboursement sur le solde',
            debit: {id: '10025', name: 'Postfinance'},
            credit: account,
            balance: amount,
            transactionDate: this.timezonePreservingDateAdapter.today(),
        };

        return [Object.assign(emptyLine, line)];
    }

    protected getDefaultForServer(): TransactionInput {
        return {
            name: '',
            remarks: '',
            internalRemarks: '',
            transactionDate: this.timezonePreservingDateAdapter.today(),
            expenseClaim: null,
        };
    }

    public getFormValidators(): FormValidators {
        return {
            name: [Validators.required, Validators.maxLength(100)],
            datatransRef: []
        };
    }

    protected getContextForUpdate(object): Literal {
        return {lines: object.transactionLines};
    }

    protected getContextForCreation(object): Literal {
        return {lines: object.transactionLines};
    }

}
