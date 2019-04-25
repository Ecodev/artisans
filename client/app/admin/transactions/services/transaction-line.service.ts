import { Injectable } from '@angular/core';
import { FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FormValidators, NaturalAbstractModelService } from '@ecodev/natural';
import { Apollo } from 'apollo-angular';
import {
    LogicalOperator,
    SortingOrder,
    TransactionLine,
    TransactionLineInput,
    TransactionLines, TransactionLineSortingField,
    TransactionLinesVariables,
    TransactionLineVariables,
    TransactionSortingField,
} from '../../../shared/generated-types';
import { transactionLineQuery, transactionLinesQuery } from './transaction-line.queries';

function atLeastOneAccount(formGroup: FormGroup): ValidationErrors | null {
    if (!formGroup || !formGroup.controls) {
        return null;
    }

    const debit = formGroup.controls.debit.value;
    const credit = formGroup.controls.credit.value;

    return debit || credit ? null : {atLeastOneAccountRequired: true};
}

@Injectable({
    providedIn: 'root',
})
export class TransactionLineService extends NaturalAbstractModelService<TransactionLine['transactionLine'],
    TransactionLineVariables,
    TransactionLines['transactionLines'],
    TransactionLinesVariables,
    null,
    any,
    null,
    any,
    null> {

    constructor(apollo: Apollo) {
        super(apollo,
            'transactionLine',
            transactionLineQuery,
            transactionLinesQuery,
            null,
            null,
            null);
    }

    public static getVariablesForAccount(account): TransactionLinesVariables {
        return {
            filter: {
                groups: [
                    {
                        conditionsLogic: LogicalOperator.OR,
                        conditions: [
                            {
                                debit: {equal: {value: account.id}},
                                credit: {equal: {value: account.id}},
                            },
                        ],
                    },
                ],
            },
            sorting: [{field: TransactionLineSortingField.transactionDate, order: SortingOrder.DESC}],
        };
    }

    public getFormValidators(): FormValidators {
        return {
            name: [Validators.required, Validators.maxLength(100)],
            balance: [Validators.required, Validators.min(0)],
        };
    }

    /**
     * TODO : force debit or credit account as required
     */
    public getFormGroupValidators(): ValidatorFn[] {
        return [atLeastOneAccount];
    }

    protected getDefaultForServer(): TransactionLineInput {
        return {
            name: '',
            remarks: '',
            balance: '',
            credit: null,
            debit: null,
            isReconciled: false,
            transactionDate: new Date(),
            transactionTag: null,
        };
    }

}
