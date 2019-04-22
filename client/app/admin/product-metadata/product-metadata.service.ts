import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
    productMetadatasQuery,
    createProductMetadataMutation,
    deleteProductMetadatas,
    updateProductMetadataMutation,
} from './product-metadata.queries';
import { Validators } from '@angular/forms';

import { NaturalAbstractModelService, FormValidators } from '@ecodev/natural';
import {
    ProductMetadataInput,
    ProductMetadatas,
    ProductMetadatasVariables, DeleteProductMetadatas,
    UpdateProductMetadata,
    UpdateProductMetadataVariables,
} from '../../shared/generated-types';

@Injectable({
    providedIn: 'root',
})
export class ProductMetadataService extends NaturalAbstractModelService<any,
    any,
    ProductMetadatas['productMetadatas'],
    ProductMetadatasVariables,
    any,
    any,
    UpdateProductMetadata['updateProductMetadata'],
    UpdateProductMetadataVariables,
    DeleteProductMetadatas> {

    constructor(apollo: Apollo) {
        super(apollo,
            'productMetadata',
            null,
            productMetadatasQuery,
            createProductMetadataMutation,
            updateProductMetadataMutation,
            deleteProductMetadatas);
    }

    protected getDefaultForServer(): ProductMetadataInput {
        return {
            name: '',
            value: '',
            product: '',
        };
    }

    public getFormValidators(): FormValidators {
        return {
            name: [Validators.required],
            value: [Validators.required],
        };
    }

}
