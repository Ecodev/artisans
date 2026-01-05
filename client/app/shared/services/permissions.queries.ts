import {gql} from '@apollo/client/core';

export const permissionsQuery = gql`
    query PermissionsQuery {
        permissions {
            crud {
                comment {
                    create
                }
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
