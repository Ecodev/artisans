import type {CodegenConfig} from '@graphql-codegen/cli';

const config: CodegenConfig = {
    overwrite: true,
    schema: 'client/app/shared/generated-schema.graphql',
    documents: 'client/**/*.ts',
    generates: {
        'client/app/shared/generated-types.ts': {
            // preset: 'near-operation-file',
            plugins: ['typescript', 'typescript-operations'],
        },
    },
    hooks: {
        afterAllFileWrite: ["prettier --ignore-path '' --write"],
    },
    config: {
        // immutableTypes:true, // TODO enable this when we have time
        onlyOperationTypes: true, // Simplifies the generated types
        preResolveTypes: true, // Simplifies the generated types
        namingConvention: 'keep', // Keeps naming as-is
        arrayInputCoercion: false,
        strictScalars: true,
        avoidOptionals: {field: true}, // Avoids optionals on the level of the field
        nonOptionalTypename: true, // Forces `__typename` on all selection sets
        skipTypeNameForRoot: true, // Don't generate __typename for root types
        omitOperationSuffix: true,
        scalars: {
            CHF: 'string',
            Chronos: 'string',
            Color: 'string',
            Date: 'string',
            EUR: 'string',
            Email: 'string',
            Password: 'string',
            Token: 'string',
            Upload: 'File',

            // All IDs
            // Ideally we should not use `any` at all, but we want to be able
            // to use either a string or an entire subobject.
            CommentID: 'string | any',
            CountryID: 'string | any',
            EventID: 'string | any',
            FileID: 'string | any',
            ImageID: 'string | any',
            LogID: 'string | any',
            MessageID: 'string | any',
            NewsID: 'string | any',
            OrderLineID: 'string | any',
            OrderID: 'string | any',
            OrganizationID: 'string | any',
            ProductID: 'string | any',
            ProductTagID: 'string | any',
            SessionID: 'string | any',
            SubscriptionID: 'string | any',
            UserID: 'string | any',
            FacilitatorDocumentID: 'string | any',
        },
    },
};

export default config;
