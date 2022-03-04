import {gql} from '@apollo/client/core';

export const userMetaFragment = gql`
    fragment UserMeta on User {
        id
        name
        email
    }
`;

export const permissionsFragment = gql`
    fragment PermissionsRUD on Permissions {
        read
        update
        delete
    }
`;
