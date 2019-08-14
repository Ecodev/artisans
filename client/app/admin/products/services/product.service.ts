import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { createProduct, deleteProducts, productQuery, productsQuery, updateProduct } from './product.queries';
import {
    CreateProduct,
    CreateProductVariables,
    DeleteProducts,
    Product,
    ProductInput,
    Products,
    ProductsVariables,
    ProductVariables,
    PurchaseStatus,
    UpdateProduct,
    UpdateProductVariables,
} from '../../../shared/generated-types';
import { Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    FormAsyncValidators,
    FormValidators,
    NaturalAbstractModelService,
    NaturalQueryVariablesManager,
    NaturalValidators,
} from '@ecodev/natural';

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

    /**
     * Filter only products in stock and active
     */
    public static getFilterForActiveInStock(): ProductsVariables {
        return {
            filter: {
                groups: [
                    {
                        conditions: [
                            {
                                isActive: {equal: {value: true}},
                                quantity: {greater: {value: '0'}},
                            },
                        ],
                    },
                ],
            },
        };
    }

    protected getDefaultForServer(): ProductInput {
        return {
            name: '',
            code: null,
            description: '',
            pricePerUnit: '0',
            supplier: '',
            supplierPrice: '0',
            supplierReference: '',
            vatRate: '0.025',
            unit: '',
            margin: '0.20',
            remarks: '',
            internalRemarks: '',
            isActive: true,
            verificationDate: null,
            image: null,
            ponderatePrice: false,
            purchaseStatus: PurchaseStatus.ok,
            minimumQuantity: '0',
        };
    }

    public getFormValidators(): FormValidators {
        return {
            code: [Validators.maxLength(20)],
            name: [Validators.required, Validators.maxLength(100)],
            minimumQuantity: [Validators.required, Validators.min(0)],
        };
    }

    public getFormAsyncValidators(): FormAsyncValidators {
        return {
            code: [NaturalValidators.unique('code', this)],
        };
    }

    public resolveByCode(code: string): Observable<{ model: any }> {

        if (code) {
            const qvm = new NaturalQueryVariablesManager<ProductsVariables>();
            const variables: ProductsVariables = {
                filter: {groups: [{conditions: [{code: {equal: {value: code}}}]}]},
            };
            qvm.set('variables', variables);

            return this.getAll(qvm).pipe(map(result => {
                return {model: result && result.items.length ? result.items[0] : null};
            }));
        } else {
            return of({model: null});
        }

    }

}
