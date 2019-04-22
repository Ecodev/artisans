import gql from 'graphql-tag';

export const openDoorMutation = gql`
    mutation OpenDoor {
        openDoor {
            message
            timer
        }
    }
`;
