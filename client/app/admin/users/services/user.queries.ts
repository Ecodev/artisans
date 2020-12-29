import {gql} from 'apollo-angular';
import {permissionsFragment, userMetaFragment} from '../../../shared/queries/fragments';

// Fragment for single display usage. Too much data for listings, and unused fields for mutations.
export const userFieldsFragment = gql`
    fragment UserFields on User {
        id
        email
        firstName
        lastName
        name
        phone
        postcode
        street
        locality
        shouldDelete
        webTemporaryAccess
        isPublicFacilitator
        country {
            id
            name
            code
        }
        role
        subscriptionType
        subscriptionLastReviewNumber
        membership
        firstLogin
        lastLogin
        owner {
            id
            name
            email
        }
        creationDate
        creator {
            ...UserMeta
        }
        updateDate
        updater {
            ...UserMeta
        }
    }
`;

export const usersQuery = gql`
    query Users($filter: UserFilter, $sorting: [UserSorting!], $pagination: PaginationInput) {
        users(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                id
                email
                phone
                name
                locality
                membership
                updateDate
                creationDate
            }
            pageSize
            pageIndex
            length
        }
    }
`;

export const emailUsersQuery = gql`
    query EmailUsers($filter: UserFilter, $sorting: [UserSorting!], $pagination: PaginationInput) {
        users(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                id
                firstName
                lastName
                email
            }
        }
    }
`;

export const userQuery = gql`
    query User($id: UserID!) {
        user(id: $id) {
            ...UserFields
            permissions {
                ...PermissionsRUD
            }
        }
    }
    ${userFieldsFragment}
    ${userMetaFragment}
    ${permissionsFragment}
`;

export const userByTokenQuery = gql`
    query UserByToken($token: Token!) {
        userByToken(token: $token) {
            ...UserFields
        }
    }
    ${userFieldsFragment}
    ${userMetaFragment}
`;

export const updateUser = gql`
    mutation UpdateUser($id: UserID!, $input: UserPartialInput!) {
        updateUser(id: $id, input: $input) {
            id
            name
            updateDate
            updater {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const deleteUsers = gql`
    mutation DeleteUsers($ids: [UserID!]!) {
        deleteUsers(ids: $ids)
    }
`;

export const createUser = gql`
    mutation CreateUser($input: UserInput!) {
        createUser(input: $input) {
            id
            name
            creator {
                ...UserMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const logoutMutation = gql`
    mutation Logout {
        logout
    }
`;

export const loginMutation = gql`
    mutation Login($email: Email!, $password: String!) {
        login(email: $email, password: $password) {
            ...UserFields
        }
    }
    ${userFieldsFragment}
    ${userMetaFragment}
`;

export const currentUserForProfileQuery = gql`
    query CurrentUserForProfile {
        viewer {
            ...UserFields
        }
    }
    ${userFieldsFragment}
    ${userMetaFragment}
`;

export const userRolesAvailableQuery = gql`
    query UserRolesAvailables($user: UserID) {
        userRolesAvailable(user: $user)
    }
`;
