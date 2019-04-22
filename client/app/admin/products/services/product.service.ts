import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { productQuery, productsQuery, createProduct, deleteProducts, updateProduct } from './product.queries';
import {
    Product,
    ProductInput,
    Products,
    ProductsVariables,
    ProductVariables,
    CreateProduct,
    CreateProductVariables,
    DeleteProducts,
    LogicalOperator,
    UpdateProduct,
    UpdateProductVariables,
} from '../../../shared/generated-types';
import { Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormValidators, NaturalAbstractModelService, NaturalQueryVariablesManager } from '@ecodev/natural';
import { ProductTagService } from '../../productTags/services/productTag.service';

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

    public static readonly membershipServices: ProductsVariables = {
        filter: {
            groups: [
                {
                    conditions: [
                        {
                            productTags: {have: {values: [ProductTagService.SERVICE]}},
                        },
                    ],
                },
                {
                    groupLogic: LogicalOperator.OR,
                    conditions: [
                        {
                            productTags: {have: {values: [ProductTagService.STORAGE]}},
                        },
                    ],
                },
            ],
        },
    };

    constructor(apollo: Apollo) {
        super(apollo,
            'product',
            productQuery,
            productsQuery,
            createProduct,
            updateProduct,
            deleteProducts);
    }

    public static getFiltersByTagId(tagId): ProductsVariables {
        return {filter: {groups: [{conditions: [{productTags: {have: {values: [tagId]}}}]}]}};
    }

    public static adminByTag(tagId): ProductsVariables {
        return {
            filter: {
                groups: [
                    {
                        conditions: [
                            {
                                productTags: {have: {values: [tagId]}},
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
            code: '',
            description: '',
            pricePerUnit: '0',
            supplierPrice: '0',
            supplierReference: '0',
            vatRate: '0',
            unit: '0',
            quantity: '0',
            remarks: '',
            isActive: true,
            verificationDate: null,
            image: null,
            creditAccount: null,
        };
    }

    public getFormValidators(): FormValidators {
        return {
            name: [Validators.required, Validators.maxLength(100)],
            code: [Validators.maxLength(100)],
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
