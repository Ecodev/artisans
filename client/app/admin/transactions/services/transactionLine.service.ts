import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AbstractModelService, FormValidators } from '../../../shared/services/abstract-model.service';
import { transactionLineQuery, transactionLinesQuery } from './transactionLine.queries';
import {
    TransactionLineInput,
    TransactionLineQuery,
    TransactionLineQueryVariables,
    TransactionLinesQuery,
    TransactionLinesQueryVariables,
    UserQuery,
} from '../../../shared/generated-types';
import { FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { QueryVariablesManager } from '../../../shared/classes/query-variables-manager';


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
export class TransactionLineService extends AbstractModelService<TransactionLineQuery['transactionLine'],
    TransactionLineQueryVariables,
    TransactionLinesQuery['transactionLines'],
    TransactionLinesQueryVariables,
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

    public getForUser(user: UserQuery['user']) {
        const variables: TransactionLinesQueryVariables = {
            filter: {groups: [{conditions: [{owner: {in: {values: [user.id]}}}]}]},
        };

        const qvm = new QueryVariablesManager<TransactionLinesQueryVariables>();
        qvm.set('variables', variables);
        return this.watchAll(qvm);
    }

}
