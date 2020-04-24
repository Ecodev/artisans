import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FormAsyncValidators, FormValidators, Literal, NaturalAbstractModelService, unique } from '@ecodev/natural';
import { Apollo } from 'apollo-angular';
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

    public getFormGroupValidators(model?: Literal): ValidatorFn[] {
        return [
            (control: FormGroup): ValidationErrors | null => {
                const reviewNumber = control.get('reviewNumber');
                const review = control.get('review');

                if (!review || !reviewNumber) {
                    return null;
                }

                if (review.value && reviewNumber.value) {
                    return {reviewXorArticle: true}
                }

                return null;
            },
        ]
    }

    public getFormValidators(): FormValidators {
        return {
            code: [Validators.maxLength(25)],
            name: [Validators.required, Validators.maxLength(100)],
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
            shortDescription: '',
            pricePerUnitCHF: '0',
            pricePerUnitEUR: '0',
            internalRemarks: '',
            isActive: true,
            image: null,
            illustration: null,
            releaseDate: null,
            review: null,
            reviewNumber: null,
            type: ProductType.digital,
            readingDuration: null,
            file: null,
        };
    }

}
