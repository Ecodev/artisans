import {NaturalErrorMessagePipe} from '@ecodev/natural';
import {Component, inject} from '@angular/core';
import {
    NaturalAbstractDetail,
    NaturalDetailHeaderComponent,
    NaturalFileComponent,
    NaturalFixedButtonDetailComponent,
    NaturalIconDirective,
    NaturalLinkableTabDirective,
    NaturalSeoResolveData,
    NaturalStampComponent,
} from '@ecodev/natural';
import {FilesService} from '../../files/services/files.service';
import {FacilitatorDocumentsService} from '../services/facilitator-documents.service';
import {CreateFile} from '../../../shared/generated-types';
import {map, Observable, of, switchMap} from 'rxjs';
import {MatDivider} from '@angular/material/divider';
import {MatInput} from '@angular/material/input';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
    selector: 'app-facilitator-document',
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
        NaturalErrorMessagePipe,
        MatInput,
        NaturalFileComponent,
        MatDivider,
        NaturalStampComponent,
        NaturalFixedButtonDetailComponent,
    ],
    templateUrl: './facilitator-document.component.html',
    styleUrl: './facilitator-document.component.scss',
})
export class FacilitatorDocumentComponent extends NaturalAbstractDetail<
    FacilitatorDocumentsService,
    NaturalSeoResolveData
> {
    private readonly fileService = inject(FilesService);

    public constructor() {
        super('facilitatorDocument', inject(FacilitatorDocumentsService));
    }

    protected createFileAndLink(file: File): Observable<CreateFile['createFile']> {
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
}
