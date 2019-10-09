import gql from 'graphql-tag';
import { userMetaFragment } from '../../../shared/queries/fragments';

export const createFileMutation = gql`
    mutation CreateFile($input: FileInput!) {
        createFile(input: $input) {
            id
            creator {
                ...userMeta
            }
        }
    }
    ${userMetaFragment}
`;

export const deleteFileMutation = gql`
    mutation DeleteFile($ids: [FileID!]!) {
        deleteFiles(ids: $ids)
    }
`;
