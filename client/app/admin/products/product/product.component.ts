import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAbstractDetail, NaturalAlertService } from '@ecodev/natural';
import { ProductService } from '../services/product.service';
import {
    CreateImage,
    CreateProduct,
    CreateProductVariables,
    Product,
    ProductVariables,
    UpdateProduct,
    UpdateProductVariables,
} from '../../../shared/generated-types';
import { ProductTagService } from '../../productTags/services/productTag.service';
import { ImageService } from '../services/image.service';
import { AccountHierarchicConfiguration } from '../../AccountHierarchicConfiguration';
import { calculateSuggestedPrice, moneyRoundUp } from '../../../shared/utils';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
})
export class ProductComponent
    extends NaturalAbstractDetail<Product['product'],
        ProductVariables,
        CreateProduct['createProduct'],
        CreateProductVariables,
        UpdateProduct['updateProduct'],
        UpdateProductVariables,
        any> implements OnInit {

    public accountHierarchicConfig = AccountHierarchicConfiguration;
    public availableVatRate = [
        '0.025',
        '0.077',
    ];

    public availableMargin = [
        '0.00', '0.05',
        '0.10', '0.15',
        '0.20', '0.25',
        '0.30', '0.35',
        '0.40', '0.45',
        '0.50', '0.55',
        '0.60', '0.65',
        '0.70', '0.75',
        '0.80', '0.85',
        '0.90', '0.95',
        '1.00',
    ];

    constructor(alertService: NaturalAlertService,
                productService: ProductService,
                router: Router,
                route: ActivatedRoute,
                public productTagService: ProductTagService,
                public imageService: ImageService,
    ) {
        super('product', productService, alertService, router, route);
    }

    ngOnInit(): void {
        super.ngOnInit();
    }


    public newImage(image: CreateImage['createImage']) {

        const imageField = this.form.get('image');
        if (imageField) {
            imageField.setValue(image);
            if (this.data.model.id) {
                this.update();
            }
        }
    }

    public calculateSuggestedPricePerUnit(): number {
        const product: Product['product'] = this.data.model;
        const suggested = calculateSuggestedPrice(product.supplierPrice, product.margin, product.vatRate);

        return moneyRoundUp(suggested);
    }
}
