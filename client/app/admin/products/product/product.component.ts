import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAbstractDetail, NaturalAlertService } from '@ecodev/natural';
import { ProductService } from '../services/product.service';
import {
    Product,
    ProductVariables,
    CreateProduct,
    CreateProductVariables,
    CreateImage,
    UpdateProduct,
    UpdateProductVariables,
} from '../../../shared/generated-types';
import { ProductTagService } from '../../productTags/services/productTag.service';
import { ImageService } from '../services/image.service';
import { AccountHierarchicConfiguration } from '../../AccountHierarchicConfiguration';

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

    public verify() {

        const partialProduct = {id: this.data.model.id, verificationDate: (new Date()).toISOString()};
        this.service.updatePartially(partialProduct).subscribe((product) => {
            this.form.patchValue(product);
        });

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
}
