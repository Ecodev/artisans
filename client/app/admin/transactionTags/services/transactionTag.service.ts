import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { NaturalAbstractModelService, FormValidators } from '../../../natural/services/abstract-model.service';
import {
    transactionTagsQuery,
    transactionTagQuery,
    createTransactionTag,
    deleteTransactionTags,
    updateTransactionTag,
} from './transactionTag.queries';
import {
    TransactionTags,
    TransactionTagsVariables,
    TransactionTagInput,
    TransactionTag,
    TransactionTagVariables,
    CreateTransactionTag,
    CreateTransactionTagVariables,
    UpdateTransactionTag,
    UpdateTransactionTagVariables,
} from '../../../shared/generated-types';
import { Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class TransactionTagService extends NaturalAbstractModelService<TransactionTag['transactionTag'],
    TransactionTagVariables,
    TransactionTags['transactionTags'],
    TransactionTagsVariables,
    CreateTransactionTag['createTransactionTag'],
    CreateTransactionTagVariables,
    UpdateTransactionTag['updateTransactionTag'],
    UpdateTransactionTagVariables,
    any> {

    constructor(apollo: Apollo) {
        super(apollo,
            'transactionTag',
            transactionTagQuery,
            transactionTagsQuery,
            createTransactionTag,
            updateTransactionTag,
            deleteTransactionTags);
    }

    protected getDefaultForServer(): TransactionTagInput {
        return {
            name: '',
            color: '',
        };
    }

    public getFormValidators(): FormValidators {
        return {
            name: [Validators.required, Validators.maxLength(100)],
        };
    }

}
