import {Component, inject} from '@angular/core';
import {
    NaturalAbstractDetail,
    NaturalAvatarComponent,
    NaturalDetailHeaderComponent,
    NaturalFileComponent,
    NaturalFixedButtonDetailComponent,
    NaturalIconDirective,
    NaturalLinkableTabDirective,
    NaturalRelationsComponent,
    NaturalSelectComponent,
    NaturalSelectEnumComponent,
    NaturalSeoResolveData,
    NaturalStampComponent,
    NaturalTableButtonComponent,
    WithId,
} from '@ecodev/natural';
import {XorErrorStateMatcher} from '../../../shared/validators';
import {FilesService} from '../../files/services/files.service';
import {ProductTagService} from '../../product-tags/services/product-tag.service';
import {ImageService} from '../services/image.service';
import {ProductService} from '../services/product.service';
import {map, Observable, of, switchMap} from 'rxjs';
import {CreateFile, CreateImage, ProductPartialInput} from '../../../shared/generated-types';
import {OrderLinesComponent} from '../../order/order-lines/order-lines.component';
import {MatDivider} from '@angular/material/divider';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {NaturalEditorComponent} from '@ecodev/natural-editor';
import {MatInput} from '@angular/material/input';
import {MatError, MatFormField, MatHint, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
    selector: 'app-product',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NaturalDetailHeaderComponent,
        MatButton,
        RouterLink,
        MatIcon,
        NaturalIconDirective,
        MatTab,
        MatTabGroup,
        NaturalLinkableTabDirective,
        MatFormField,
        MatLabel,
        MatError,
        MatHint,
        MatSuffix,
        MatInput,
        NaturalEditorComponent,
        CdkTextareaAutosize,
        MatSlideToggle,
        NaturalSelectEnumComponent,
        MatDatepicker,
        MatDatepickerInput,
        MatDatepickerToggle,
        NaturalSelectComponent,
        MatDivider,
        NaturalFileComponent,
        NaturalRelationsComponent,
        NaturalAvatarComponent,
        NaturalTableButtonComponent,
        NaturalStampComponent,
        OrderLinesComponent,
        NaturalFixedButtonDetailComponent,
    ],
    templateUrl: './product.component.html',
    styleUrl: './product.component.scss',
})
export class ProductComponent extends NaturalAbstractDetail<ProductService, NaturalSeoResolveData> {
    public readonly productTagService = inject(ProductTagService);
    private readonly imageService = inject(ImageService);
    private readonly fileService = inject(FilesService);

    public reviewXorArticleErrorStateMatcher = new XorErrorStateMatcher('reviewXorArticle');

    public constructor() {
        super('product', inject(ProductService));
    }

    public createFileAndLink(file: File): Observable<CreateFile['createFile']> {
        return this.fileService.create({file}).pipe(
            switchMap(newFile => {
                const id = this.data.model.id;
                return id
                    ? this.service
                          .updateNow({
                              id,
                              file: newFile,
                          })
                          .pipe(map(() => newFile))
                    : of(newFile);
            }),
        );
    }

    public createImageAndLink(key: 'illustration' | 'image'): (file: File) => Observable<CreateImage['createImage']> {
        return file =>
            this.imageService.create({file}).pipe(
                switchMap(image => {
                    const id = this.data.model.id;
                    if (!id) {
                        return of(image);
                    }

                    const object: WithId<ProductPartialInput> = {
                        id,
                    };
                    object[key] = image;

                    return this.service.updateNow(object).pipe(map(() => image));
                }),
            );
    }
}
