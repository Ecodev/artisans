import gql from 'graphql-tag';

export const enumTypeQuery = gql`
    query EnumType($name: String!) {
        __type(name:$name) {
            __typename
            enumValues {
                name
                description
            }
        }
    }`;
