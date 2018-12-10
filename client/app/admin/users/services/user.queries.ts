import gql from 'graphql-tag';
import { userMetaFragment } from '../../../shared/queries/fragments';

export const usersQuery = gql`
    query Users($filter: UserFilter, $sorting: [UserSorting!], $pagination: PaginationInput) {
        users(filter: $filter, sorting: $sorting, pagination: $pagination) {
            items {
                id
                login
                name
                activeUntil
            }
            pageSize
            pageIndex
            length
        }
    }`;

export const userQuery = gql`
    query User($id: UserID!) {
        user(id: $id) {
            id
            login
            name
            email
            activeUntil
            birthday
            phone
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

export const updateUserMutation = gql`
    mutation UpdateUser($id: UserID!, $input: UserPartialInput!) {
        updateUser(id:$id, input:$input) {
            id
            updateDate
            updater {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const createUserMutation = gql`
    mutation CreateUser ($input: UserInput!) {
        createUser (input: $input) {
            id
            name
            creator {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const logoutMutation = gql`
    mutation Logout {
        logout
    }`;

export const loginMutation = gql`
    mutation Login($login: Login!, $password: String!) {
        login(login:$login, password:$password) {
            id
            login
            name
            email
            phone
            birthday
            creator {
                ...userMeta
            }
            updateDate
            updater {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const currentUserForProfileQuery = gql`
    query CurrentUserForProfile {
        viewer {
            id
            login
            name
            email
            phone
            birthday
            creator {
                ...userMeta
            }
            updateDate
            updater {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;

