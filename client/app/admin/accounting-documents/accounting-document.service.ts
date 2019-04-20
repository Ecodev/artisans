import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import gql from 'graphql-tag';
import { AccountingDocumentInput, CreateAccountingDocument, CreateAccountingDocumentVariables } from '../../shared/generated-types';
import { userMetaFragment } from '../../shared/queries/fragments';
import { NaturalAbstractModelService } from '@ecodev/natural';

export const createAccountingDocumentMutation = gql`
    mutation CreateAccountingDocument($input: AccountingDocumentInput!) {
        createAccountingDocument(input: $input) {
            id
            creator {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;

@Injectable({
    providedIn: 'root',
})
export class AccountingDocumentService extends NaturalAbstractModelService<any,
    any,
    any,
    any,
    CreateAccountingDocument['createAccountingDocument'],
    CreateAccountingDocumentVariables,
    any,
    any,
    any> {

    constructor(apollo: Apollo) {
        super(apollo,
            'image',
            null,
            null,
            createAccountingDocumentMutation,
            null,
            null);
    }

    protected getDefaultForServer(): AccountingDocumentInput {
        return {
            file: '',
            expenseClaim: null,
            transaction: null,
        };
    }

}
