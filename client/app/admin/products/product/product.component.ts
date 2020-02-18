import { Component, Injector, OnInit } from '@angular/core';
import { NaturalAbstractDetail } from '@ecodev/natural';
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
import { ProductTagService } from '../../product-tags/services/product-tag.service';
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

    public orderLinesVariables: OrderLinesVariables;

    constructor(private productService: ProductService,
                injector: Injector,
                public productTagService: ProductTagService,
                public imageService: ImageService,
    ) {
        super('product', productService, injector);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.orderLinesVariables = {filter: {groups: [{conditions: [{product: {equal: {value: this.data.model.id}}}]}]}};
    }

    public newImage(image: CreateImage['createImage'], fieldName: string) {

        const field = this.form.get(fieldName);
        if (field) {
            field.setValue(image);
            if (this.data.model.id) {
                this.update();
            }
        }
    }
}
