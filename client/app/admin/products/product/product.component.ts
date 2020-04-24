import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { NaturalAbstractDetail } from '@ecodev/natural';
import {
    CreateProduct,
    CreateProductVariables,
    Product,
    ProductVariables,
    UpdateProduct,
    UpdateProductVariables,
} from '../../../shared/generated-types';
import { FilesService } from '../../files/services/files.service';
import { ProductTagService } from '../../product-tags/services/product-tag.service';
import { ImageService } from '../services/image.service';
import { ProductService } from '../services/product.service';

class ReviewXorArticleErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        if (!form) {
            return false;
        }

        const formGroup = form.form;
        const isDirty = !!(formGroup.get('review')?.dirty || formGroup.get('reviewNumber')?.dirty);

        return formGroup.hasError('reviewXorArticle') && isDirty;
    }
}

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

    public reviewXorArticleErrorStateMatcher = new ReviewXorArticleErrorStateMatcher();

    constructor(public productService: ProductService,
                injector: Injector,
                public productTagService: ProductTagService,
                public imageService: ImageService,
                public fileService: FilesService,
    ) {
        super('product', productService, injector);
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }

    public setFormValue(value: any, fieldName: string) {
        const field = this.form.get(fieldName);
        if (field) {
            field.setValue(value);
            if (this.data.model.id) {
                this.update();
            }
        }
    }

}
