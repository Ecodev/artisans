import gql from 'graphql-tag';
import { userMetaFragment } from '../../../shared/queries/fragments';

export const resourceMetaFragment = gql`
    fragment resourceMeta on Resource {
        id
        name
        description
    }
`;

export const resourcesQuery = gql`
    query Resources($filter: ResourceFilter, $pagination: PaginationInput) {
        resources(filter: $filter, pagination: $pagination) {
            items {
                ...resourceMeta
            }
            pageSize
            pageIndex
            length
        }
    }
${resourceMetaFragment}`;

export const resourceQuery = gql`
    query Resource($id: ResourceID!) {
        resource(id: $id) {
            id
            ...resourceMeta
            creator {
                ...userMeta
            }
            updateDate
            updater {
                ...userMeta
            }
        }
    }
${resourceMetaFragment}
${userMetaFragment}`;

export const createResourceMutation = gql`
    mutation CreateResource($input: ResourceInput!) {
        createResource(input: $input) {
            id
            creator {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const updateResourceMutation = gql`
    mutation UpdateResource($id: ResourceID!, $input: ResourcePartialInput!) {
        updateResource(id:$id, input:$input) {
            id
            updateDate
            updater {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;
