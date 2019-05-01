import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAbstractDetail, NaturalAlertService } from '@ecodev/natural';
import {
    CreateImage,
    CreateProduct,
    CreateProductVariables,
    OrderLinesVariables,
    Product,
    ProductVariables,
    UpdateProduct,
    UpdateProductVariables,
} from '../../../shared/generated-types';
import { calculateSuggestedPrice, moneyRoundUp } from '../../../shared/utils';
import { ProductTagService } from '../../productTags/services/productTag.service';
import { ImageService } from '../services/image.service';
import { ProductService } from '../services/product.service';

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

    public availableVatRate = [
        '0.025',
        '0.077',
    ];

    public availableMargin = [
        '0.15',
        '0.16',
        '0.17',
        '0.18',
        '0.19',
        '0.20',
        '0.21',
        '0.22',
        '0.23',
        '0.24',
        '0.25',
    ];

    public orderLinesVariables: OrderLinesVariables;

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
        this.orderLinesVariables = {filter: {groups: [{conditions: [{product: {equal: {value: this.data.model.id}}}]}]}};
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

    public verify() {

        const partialBookable = {id: this.data.model.id, verificationDate: (new Date()).toISOString()};
        this.service.updatePartially(partialBookable).subscribe((bookable) => {
            this.form.patchValue(bookable);
        });

    }

}
