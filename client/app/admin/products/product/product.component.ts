import {Component, Injector} from '@angular/core';
import {NaturalAbstractDetail} from '@ecodev/natural';
import {XorErrorStateMatcher} from '../../../shared/validators';
import {FilesService} from '../../files/services/files.service';
import {ProductTagService} from '../../product-tags/services/product-tag.service';
import {ImageService} from '../services/image.service';
import {ProductService} from '../services/product.service';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
})
export class ProductComponent extends NaturalAbstractDetail<ProductService> {
    public reviewXorArticleErrorStateMatcher = new XorErrorStateMatcher('reviewXorArticle');

    public constructor(
        public readonly productService: ProductService,
        injector: Injector,
        public readonly productTagService: ProductTagService,
        public readonly imageService: ImageService,
        public readonly fileService: FilesService,
    ) {
        super('product', productService, injector);
    }

    public setFormValue(value: any, fieldName: string): void {
        const field = this.form.get(fieldName);
        if (field) {
            field.setValue(value);
            if (this.data.model.id) {
                this.update();
            }
        }
    }
}
