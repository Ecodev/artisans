import gql from 'graphql-tag';
import { userMetaFragment } from '../../../shared/queries/fragments';

export const accountMetaFragment = gql`
    fragment accountMeta on Account {
        id
        code
        name
        iban
        balance
        type
        owner {
            id
            name
        }
    }
`;

export const accountsQuery = gql`
    query Accounts($filter: AccountFilter, $sorting: [AccountSorting!], $pagination: PaginationInput) {
        accounts(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                ...accountMeta
            }
            pageSize
            pageIndex
            length
        }
    }
${accountMetaFragment}`;

export const accountQuery = gql`
    query Account($id: AccountID!) {
        account(id: $id) {
            id
            ...accountMeta
            parent {
                id
                name
                parent {
                    id
                    name
                    parent {
                        id
                        name
                    }
                }
            }
            creationDate
            creator {
                ...userMeta
            }
            updateDate
            updater {
                ...userMeta
            }
        }
    }
    ${accountMetaFragment}
${userMetaFragment}`;

export const createAccountMutation = gql`
    mutation CreateAccount($input: AccountInput!) {
        createAccount(input: $input) {
            id
            creator {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const updateAccountMutation = gql`
    mutation UpdateAccount($id: AccountID!, $input: AccountPartialInput!) {
        updateAccount(id:$id, input:$input) {
            id
            updateDate
            updater {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const deleteAccountsMutation = gql`
    mutation DeleteAccounts ($ids: [AccountID!]!){
        deleteAccounts(ids: $ids)
    }`;
