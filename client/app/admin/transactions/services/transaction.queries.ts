import gql from 'graphql-tag';
import { userMetaFragment } from '../../../shared/queries/fragments';

export const transactionMetaFragment = gql`
    fragment transactionMeta on Transaction {
        id
        name
        accountingDocuments {
            id
            mime
        }
        expenseClaim {
            id
            amount
            name
            description
            accountingDocuments {
                id
                mime
            }
        }
        remarks
        internalRemarks
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
    mutation CreateTransaction($input: TransactionInput!, $lines: [TransactionLineInput!]!) {
        createTransaction(input: $input, lines: $lines) {
            id
            creator {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;
