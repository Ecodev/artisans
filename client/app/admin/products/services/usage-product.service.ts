import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
    productQuery,
    createProduct,
    deleteProducts,
    updateProduct,
    usageProductsQuery,
} from './product.queries';
import {
    Product,
    Products,
    ProductVariables,
    CreateProduct,
    CreateProductVariables,
    DeleteProducts,
    UpdateProduct,
    UpdateProductVariables,
    UsageProductsVariables,
} from '../../../shared/generated-types';
import { NaturalAbstractModelService } from '@ecodev/natural';

@Injectable({
    providedIn: 'root',
})
export class UsageProductService extends NaturalAbstractModelService<Product['product'],
    ProductVariables,
    Products['products'],
    UsageProductsVariables,
    CreateProduct['createProduct'],
    CreateProductVariables,
    UpdateProduct['updateProduct'],
    UpdateProductVariables,
    DeleteProducts> {

    constructor(apollo: Apollo) {
        super(apollo,
            'product',
            productQuery,
            usageProductsQuery,
            createProduct,
            updateProduct,
            deleteProducts);
    }

}
