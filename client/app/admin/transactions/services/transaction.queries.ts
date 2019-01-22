import gql from 'graphql-tag';
import { userMetaFragment } from '../../../shared/queries/fragments';

export const transactionMetaFragment = gql`
    fragment transactionMeta on Transaction {
        id
        name
        transactionDate
        remarks
        internalRemarks
        amount
        account {
            id
            name
            user {
                id
                name
            }
        }
        expenseClaim {
            id
            name
        }
    }
`;

export const transactionsQuery = gql`
    query Transactions($filter: TransactionFilter, $sorting: [TransactionSorting!], $pagination: PaginationInput) {
        transactions(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                ...transactionMeta
            }
            pageSize
            pageIndex
            length
        }
    }
${transactionMetaFragment}`;

export const transactionQuery = gql`
    query Transaction($id: TransactionID!) {
        transaction(id: $id) {
            id
            ...transactionMeta
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
    ${transactionMetaFragment}
${userMetaFragment}`;

export const createTransactionMutation = gql`
    mutation CreateTransaction($input: TransactionInput!) {
        createTransaction(input: $input) {
            id
            creator {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const updateTransactionMutation = gql`
    mutation UpdateTransaction($id: TransactionID!, $input: TransactionPartialInput!) {
        updateTransaction(id:$id, input:$input) {
            id
            updateDate
            updater {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const deleteTransactionsMutation = gql`
    mutation DeleteTransactions ($ids: [TransactionID!]!){
        deleteTransactions(ids: $ids)
    }`;
