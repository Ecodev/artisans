import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormValidators, Literal, NaturalAbstractModelService, NaturalQueryVariablesManager } from '@ecodev/natural';
import { Apollo } from 'apollo-angular';
import { Observable, Subject } from 'rxjs';
import {
    Account,
    CreateTransaction,
    CreateTransactionVariables,
    DeleteTransactions,
    LogicalOperator,
    SortingOrder,
    Transaction,
    TransactionInput,
    TransactionLineInput,
    Transactions,
    TransactionSortingField,
    TransactionsVariables,
    TransactionVariables,
    UpdateTransaction,
    UpdateTransactionVariables,
} from '../../../shared/generated-types';
import { createTransaction, deleteTransactions, transactionQuery, transactionsQuery, updateTransaction } from './transaction.queries';
import { TransactionLineService } from './transaction-line.service';

@Injectable({
    providedIn: 'root',
})
export class TransactionService extends NaturalAbstractModelService<Transaction['transaction'],
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
    ) {
        super(apollo,
            'transaction',
            transactionQuery,
            transactionsQuery,
            createTransaction,
            updateTransaction,
            deleteTransactions);
    }

    public static getVariablesForAccount(account): TransactionsVariables {
        return {
            filter: {
                groups: [
                    {
                        groupLogic: LogicalOperator.OR,
                        joins: {transactionLines: {conditions: [{debit: {equal: {value: account.id}}}]}},
                    },
                    {
                        groupLogic: LogicalOperator.OR,
                        joins: {transactionLines: {conditions: [{credit: {equal: {value: account.id}}}]}},
                    },
                ],
            },
            sorting: [{field: TransactionSortingField.transactionDate, order: SortingOrder.DESC}],
        };
    }

    public getRefundPreset(account: { id: string }, amount: string): TransactionLineInput[] {

        const emptyLine = this.transactionLineService.getConsolidatedForClient();

        const line: TransactionLineInput = {
            name: 'Remboursement du membre',
            debit: account,
            credit: {id: '10025', name: 'Postfinance'},
            balance: amount,
            transactionDate: new Date(),
        };

        return [Object.assign(emptyLine, line)];
    }

    public getExpenseClaimPreset(account: { id: string }, amount: string): TransactionLineInput[] {

        const emptyLine = this.transactionLineService.getConsolidatedForClient();

        const line: TransactionLineInput = {
            name: 'Remboursement sur le solde',
            debit: {id: '10025', name: 'Postfinance'},
            credit: account,
            balance: amount,
            transactionDate: new Date(),
        };

        return [Object.assign(emptyLine, line)];
    }

    public getFormValidators(): FormValidators {
        return {
            name: [Validators.required, Validators.maxLength(100)],
            datatransRef: [],
        };
    }

    public getForAccount(account: Account['account'], expire: Subject<void>): Observable<Transactions['transactions']> {

        const variables = TransactionService.getVariablesForAccount(account);
        variables.pagination = {pageIndex: 0, pageSize: 9999};

        const qvm = new NaturalQueryVariablesManager<TransactionsVariables>();
        qvm.set('variables', variables);
        return this.watchAll(qvm, expire);
    }

    protected getDefaultForServer(): TransactionInput {
        return {
            name: '',
            remarks: '',
            internalRemarks: '',
            transactionDate: new Date(),
            expenseClaim: null,
        };
    }

    protected getContextForUpdate(object): Literal {
        return {lines: object.transactionLines};
    }

    protected getContextForCreation(object): Literal {
        return {lines: object.transactionLines};
    }

}
