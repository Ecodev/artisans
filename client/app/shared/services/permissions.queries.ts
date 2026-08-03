import {gql} from '@apollo/client';

export const permissionsQuery = gql`
    query PermissionsQuery {
        permissions {
            crud {
                configuration {
                    create
                }
                event {
                    create
                }
                image {
                    create
                }
                message {
                    create
                }
                news {
                    create
                }
                organization {
                    create
                }
                product {
                    create
                }
                productTag {
                    create
                }
                session {
                    create
                }
                subscription {
                    create
                }
                user {
                    create
                }
                facilitatorDocument {
                    create
                }
            }
        }
    }
`;
