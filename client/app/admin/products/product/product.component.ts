import {Component, Injector} from '@angular/core';
import {NaturalAbstractDetail, WithId} from '@ecodev/natural';
import {XorErrorStateMatcher} from '../../../shared/validators';
import {FilesService} from '../../files/services/files.service';
import {ProductTagService} from '../../product-tags/services/product-tag.service';
import {ImageService} from '../services/image.service';
import {ProductService} from '../services/product.service';
import {map, Observable, of, switchMap} from 'rxjs';
import {CreateFile_createFile, CreateImage_createImage, ProductPartialInput} from '../../../shared/generated-types';

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
        private readonly imageService: ImageService,
        private readonly fileService: FilesService,
    ) {
        super('product', productService, injector);
    }

    public createFileAndLink(file: File): Observable<CreateFile_createFile> {
        return this.fileService.create({file}).pipe(
            switchMap(newFile => {
                const id = this.data.model.id;
                return id
                    ? this.service
                          .updatePartially({
                              id,
                              file: newFile,
                          })
                          .pipe(map(() => newFile))
                    : of(newFile);
            }),
        );
    }

    public createImageAndLink(key: 'illustration' | 'image'): (file: File) => Observable<CreateImage_createImage> {
        return file =>
            this.imageService.create({file}).pipe(
                switchMap(image => {
                    const id = this.data.model.id;
                    const object: WithId<ProductPartialInput> = {
                        id,
                    };
                    object[key] = image;

                    return id ? this.service.updatePartially(object).pipe(map(() => image)) : of(image);
                }),
            );
    }
}
