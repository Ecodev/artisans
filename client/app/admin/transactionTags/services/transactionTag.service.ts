import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AbstractModelService, FormValidators } from '../../../shared/services/abstract-model.service';
import {
    transactionTagsQuery,
    transactionTagQuery,
    createTransactionTagMutation,
    deleteTransactionTagsMutation,
    updateTransactionTagMutation,
} from './transactionTag.queries';
import {
    TransactionTagsQuery,
    TransactionTagsQueryVariables,
    TransactionTagInput,
    TransactionTagQuery,
    TransactionTagQueryVariables,
    CreateTransactionTagMutation,
    CreateTransactionTagMutationVariables,
    UpdateTransactionTagMutation,
    UpdateTransactionTagMutationVariables,
} from '../../../shared/generated-types';
import { Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class TransactionTagService extends AbstractModelService<TransactionTagQuery['transactionTag'],
    TransactionTagQueryVariables,
    TransactionTagsQuery['transactionTags'],
    TransactionTagsQueryVariables,
    CreateTransactionTagMutation['createTransactionTag'],
    CreateTransactionTagMutationVariables,
    UpdateTransactionTagMutation['updateTransactionTag'],
    UpdateTransactionTagMutationVariables,
    any> {

    constructor(apollo: Apollo) {
        super(apollo,
            'transactionTag',
            transactionTagQuery,
            transactionTagsQuery,
            createTransactionTagMutation,
            updateTransactionTagMutation,
            deleteTransactionTagsMutation);
    }

    public getEmptyObject(): TransactionTagInput {
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
