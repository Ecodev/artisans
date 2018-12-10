import gql from 'graphql-tag';
import { userMetaFragment } from '../../../shared/queries/fragments';

export const bookableTypeMetaFragment = gql`
    fragment bookableTypeMeta on BookableType {
        id
        name
    }
`;

export const bookableTypesQuery = gql`
    query BookableTypes($filter: BookableTypeFilter, $sorting: [BookableTypeSorting!], $pagination: PaginationInput) {
        bookableTypes(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                ...bookableTypeMeta
            }
            pageSize
            pageIndex
            length
        }
    }
${bookableTypeMetaFragment}`;

export const bookableTypeQuery = gql`
    query BookableType($id: BookableTypeID!) {
        bookableType(id: $id) {
            id
            ...bookableTypeMeta
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
    ${bookableTypeMetaFragment}
${userMetaFragment}`;
