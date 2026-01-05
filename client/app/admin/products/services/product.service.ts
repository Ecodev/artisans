import {Injectable} from '@angular/core';
import {ValidatorFn, Validators} from '@angular/forms';
import {
    FormAsyncValidators,
    FormValidators,
    Literal,
    money,
    NaturalAbstractModelService,
    unique,
} from '@ecodev/natural';
import {
    CreateProduct,
    CreateProductVariables,
    DeleteProducts,
    DeleteProductsVariables,
    ProductQuery,
    ProductInput,
    ProductPartialInput,
    ProductsQuery,
    ProductSorting,
    ProductSortingField,
    ProductsQueryVariables,
    ProductType,
    ProductQueryVariables,
    SortingOrder,
    UpdateProduct,
    UpdateProductVariables,
} from '../../../shared/generated-types';
import {xorValidator} from '../../../shared/validators';
import {createProduct, deleteProducts, productQuery, productsQuery, updateProduct} from './product.queries';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ProductService extends NaturalAbstractModelService<
    ProductQuery['product'],
    ProductQueryVariables,
    ProductsQuery['products'],
    ProductsQueryVariables,
    CreateProduct['createProduct'],
    CreateProductVariables,
    UpdateProduct['updateProduct'],
    UpdateProductVariables,
    DeleteProducts,
    DeleteProductsVariables
> {
    public static readonly MEMBERSHIP_FEE_PRODUCT_ID = '1314';

    public static readonly articlesSorting: ProductSorting[] = [
        {field: ProductSortingField.isHighlighted, order: SortingOrder.DESC, nullAsHighest: true},
        {field: ProductSortingField.illustration, order: SortingOrder.DESC},
        {field: ProductSortingField.sorting, order: SortingOrder.ASC},
    ];

    public constructor() {
        super('product', productQuery, productsQuery, createProduct, updateProduct, deleteProducts);
    }

    public override getFormGroupValidators(): ValidatorFn[] {
        return [xorValidator('reviewXorArticle', ['reviewNumber', 'review'])];
    }

    public override getFormValidators(): FormValidators {
        return {
            pricePerUnitCHF: [Validators.required, money],
            pricePerUnitEUR: [Validators.required, money],
            code: [Validators.maxLength(25)],
            name: [Validators.required, Validators.maxLength(100)],
        };
    }

    public override getFormAsyncValidators(model: ProductQuery['product']): FormAsyncValidators {
        return {
            code: [unique('code', model.id, this)],
        };
    }

    public override getInput(object: Literal, forCreation: boolean): ProductInput | ProductPartialInput {
        object.description = object.description || '';
        return super.getInput(object, forCreation);
    }

    public getMembershipProduct(): Observable<ProductQuery['product']> {
        return this.getOne(ProductService.MEMBERSHIP_FEE_PRODUCT_ID);
    }

    public override getDefaultForServer(): ProductInput {
        return {
            name: '',
            code: null,
            description: '',
            content: '',
            pricePerUnitCHF: '0',
            pricePerUnitEUR: '0',
            internalRemarks: '',
            isActive: true,
            isHighlighted: false,
            image: null,
            illustration: null,
            releaseDate: null,
            review: null,
            reviewNumber: null,
            type: ProductType.Digital,
            readingDuration: null,
            file: null,
        };
    }
}
