import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAbstractDetail } from '@ecodev/natural';
import { NaturalAlertService } from '@ecodev/natural';
import {
    ProductTag,
    ProductTagVariables,
    CreateProductTag,
    CreateProductTagVariables,
    DeleteProductTags,
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

    constructor(alertService: NaturalAlertService,
                productTagService: ProductTagService,
                router: Router,
                route: ActivatedRoute,
                public tagService: ProductTagService,
    ) {
        super('productTag', productTagService, alertService, router, route);
    }
}
