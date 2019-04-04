import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AbstractModelService, AutoRefetchQueryRef, FormValidators } from '../../../shared/services/abstract-model.service';
import { transactionLineQuery, transactionLinesQuery } from './transactionLine.queries';
import {
    LogicalOperator,
    SortingOrder,
    TransactionLine,
    TransactionLineInput,
    TransactionLines,
    TransactionLineSortingField,
    TransactionLinesVariables,
    TransactionLineVariables,
    User,
} from '../../../shared/generated-types';
import { FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { QueryVariablesManager } from '../../../shared/classes/query-variables-manager';
import { of } from 'rxjs';

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
export class TransactionLineService extends AbstractModelService<TransactionLine['transactionLine'],
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

    public getEmptyObject(): TransactionLineInput {
        return {
            name: '',
            remarks: '',
            balance: '',
            credit: null,
            debit: null,
            bookable: null,
            datatransRef: '',
            isReconciled: false,
            transactionDate: '',
            transactionTag: null,
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

    public getForUser(user: User['user']) {
        const accountId = user.account ? user.account.id : null;

        if (!accountId) {
            return {
                valueChanges: of(null),
                unsubscribe: () => {
                },
            } as AutoRefetchQueryRef<any>;
        }

        const variables: TransactionLinesVariables = {
            filter: {
                groups: [
                    {
                        conditionsLogic: LogicalOperator.OR,
                        conditions: [
                            {credit: {equal: {value: accountId}}},
                            {debit: {equal: {value: accountId}}},
                        ],
                    },

                ],
            },
            sorting: [{field: TransactionLineSortingField.transactionDate, order: SortingOrder.DESC}],
            pagination: {pageIndex: 0, pageSize: 9999}
        };

        const qvm = new QueryVariablesManager<TransactionLinesVariables>();
        qvm.set('variables', variables);
        return this.watchAll(qvm, true);
    }

}
