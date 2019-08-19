import { Component, Injector } from '@angular/core';
import { NaturalAbstractDetail } from '@ecodev/natural';
import {
    CreateProductTag,
    CreateProductTagVariables,
    DeleteProductTags,
    ProductTag,
    ProductTagVariables,
    UpdateProductTag,
    UpdateProductTagVariables,
} from '../../../shared/generated-types';
import { ProductTagService } from '../services/productTag.service';

@Component({
    selector: 'app-product-tag',
    templateUrl: './productTag.component.html',
    styleUrls: ['./productTag.component.scss'],
})
export class ProductTagComponent
    extends NaturalAbstractDetail<ProductTag['productTag'],
        ProductTagVariables,
        CreateProductTag['createProductTag'],
        CreateProductTagVariables,
        UpdateProductTag['updateProductTag'],
        UpdateProductTagVariables,
        DeleteProductTags> {

    constructor(productTagService: ProductTagService,
                injector: Injector,
                public tagService: ProductTagService,
    ) {
        super('productTag', productTagService, injector);
    }
}
