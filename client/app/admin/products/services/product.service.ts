import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { createProduct, deleteProducts, productQuery, productsQuery, updateProduct } from './product.queries';
import {
    CreateProduct,
    CreateProductVariables,
    DeleteProducts,
    LogicalOperator,
    Product,
    ProductInput,
    Products,
    ProductsVariables,
    ProductVariables,
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
            supplier: '',
            supplierPrice: '0',
            supplierReference: '',
            vatRate: '0.077',
            unit: '',
            quantity: '0',
            margin: '0.20',
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
