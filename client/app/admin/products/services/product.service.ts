import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import {
    FormAsyncValidators,
    FormValidators,
    NaturalAbstractModelService,
    NaturalQueryVariablesManager,
    unique,
} from '@ecodev/natural';
import { Apollo } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    CreateProduct,
    CreateProductVariables,
    DeleteProducts,
    Product,
    Product_product,
    ProductInput,
    Products,
    ProductsVariables,
    ProductType,
    ProductVariables,
    UpdateProduct,
    UpdateProductVariables,
} from '../../../shared/generated-types';
import { createProduct, deleteProducts, productQuery, productsQuery, updateProduct } from './product.queries';

@Injectable({
    providedIn: 'root',
})
export class ProductService extends NaturalAbstractModelService<Product['product'],
    ProductVariables,
    Products['products'],
    ProductsVariables,
    CreateProduct['createProduct'],
    CreateProductVariables,
    UpdateProduct['updateProduct'],
    UpdateProductVariables,
    DeleteProducts> {

    constructor(apollo: Apollo) {
        super(apollo,
            'product',
            productQuery,
            productsQuery,
            createProduct,
            updateProduct,
            deleteProducts);
    }

    public getFormValidators(): FormValidators {
        return {
            code: [Validators.maxLength(20)],
            name: [Validators.required, Validators.maxLength(100)],
            minimumQuantity: [Validators.required, Validators.min(0)],
        };
    }

    public getFormAsyncValidators(model: Product_product): FormAsyncValidators {
        return {
            code: [unique('code', model.id, this)],
        };
    }

    protected getDefaultForServer(): ProductInput {
        return {
            name: '',
            code: null,
            description: '',
            pricePerUnitCHF: '0',
            pricePerUnitEUR: '0',
            internalRemarks: '',
            isActive: true,
            image: null,
            illustration: null,
            releaseDate: null,
            reviewNumber: 0,
            type: ProductType.digital,
        };
    }

}
