import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { NaturalAbstractModelService, FormValidators } from '@ecodev/natural';
import { productTagQuery, productTagsQuery, createProductTag, deleteProductTags, updateProductTag } from './productTag.queries';
import {
    ProductTag,
    ProductTagInput,
    ProductTags,
    ProductTagsVariables,
    ProductTagVariables,
    CreateProductTag,
    CreateProductTagVariables,
    UpdateProductTag,
    UpdateProductTagVariables,
} from '../../../shared/generated-types';
import { Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class ProductTagService extends NaturalAbstractModelService<ProductTag['productTag'],
    ProductTagVariables,
    ProductTags['productTags'],
    ProductTagsVariables,
    CreateProductTag['createProductTag'],
    CreateProductTagVariables,
    UpdateProductTag['updateProductTag'],
    UpdateProductTagVariables,
    any> {

    constructor(apollo: Apollo) {
        super(apollo,
            'productTag',
            productTagQuery,
            productTagsQuery,
            createProductTag,
            updateProductTag,
            deleteProductTags);
    }

    protected getDefaultForServer(): ProductTagInput {
        return {
            name: '',
            color: '',
        };
    }

    public getFormValidators(): FormValidators {
        return {
            name: [Validators.required, Validators.maxLength(100)],
        };
    }

}
