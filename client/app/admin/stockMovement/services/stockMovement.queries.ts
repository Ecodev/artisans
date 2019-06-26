import gql from 'graphql-tag';
import { permissionsFragment, userMetaFragment } from '../../../shared/queries/fragments';

export const stockMovementMetaFragment = gql`
    fragment stockMovementMeta on StockMovement {
        id
        type
        delta
        quantity
        remarks
        product {
            id
            name
            unit
        }
        creationDate
        updateDate
    }
`;

export const stockMovementsQuery = gql`
    query StockMovements($filter: StockMovementFilter, $sorting: [StockMovementSorting!], $pagination: PaginationInput) {
        stockMovements(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                ...stockMovementMeta
                owner {
                    ...userMeta
                }
            }
            pageSize
            pageIndex
            length
            totalDelta
            totalSale
            totalLoss
            totalDelivery
            totalInventory
        }
    }
    ${stockMovementMetaFragment}
    ${userMetaFragment}
`;

export const stockMovementQuery = gql`
    query StockMovement($id: StockMovementID!) {
        stockMovement(id: $id) {
            id
            ...stockMovementMeta
            creationDate
            creator {
                ...userMeta
            }
            updateDate
            updater {
                ...userMeta
            }
            permissions {
                ...permissions
            }
        }
    }
    ${stockMovementMetaFragment}
    ${userMetaFragment}
    ${permissionsFragment}
`;

export const createStockMovement = gql`
    mutation CreateStockMovement($input: StockMovementInput!, $product: ProductID!) {
        createStockMovement(input: $input, product: $product) {
            id
            product {
                id
                quantity
            }
            creator {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const deleteStockMovements = gql`
    mutation DeleteStockMovements ($ids: [StockMovementID!]!){
        deleteStockMovements(ids: $ids)
    }`;
