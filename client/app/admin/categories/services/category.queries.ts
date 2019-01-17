import gql from 'graphql-tag';
import { userMetaFragment } from '../../../shared/queries/fragments';

export const categoriesQuery = gql`
    query Categories($filter: CategoryFilter, $sorting: [CategorySorting!], $pagination: PaginationInput) {
        categories(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                id
                name
                color
            }
            pageSize
            pageIndex
            length
        }
    }
`;

export const categoryQuery = gql`
    query Category($id: CategoryID!) {
        category(id: $id) {
            id
            name
            color
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
${userMetaFragment}`;

export const createCategoryMutation = gql`
    mutation CreateCategory($input: CategoryInput!) {
        createCategory(input: $input) {
            id
            creator {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const updateCategoryMutation = gql`
    mutation UpdateCategory($id: CategoryID!, $input: CategoryPartialInput!) {
        updateCategory(id:$id, input:$input) {
            id
            updateDate
            updater {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const deleteCategoriesMutation = gql`
    mutation DeleteCategories ($ids: [CategoryID!]!){
        deleteCategories(ids: $ids)
    }`;

