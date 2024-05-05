import {Component} from '@angular/core';
import {
    NaturalAbstractDetail,
    NaturalDetailHeaderComponent,
    NaturalIconDirective,
    NaturalLinkableTabDirective,
    NaturalFileComponent,
    NaturalStampComponent,
    NaturalFixedButtonDetailComponent,
    NaturalSeoResolveData,
} from '@ecodev/natural';
import {FilesService} from '../../files/services/files.service';
import {FacilitatorDocumentsService} from '../services/facilitator-documents.service';
import {CreateFile} from '../../../shared/generated-types';
import {map, Observable, of, switchMap} from 'rxjs';
import {MatDividerModule} from '@angular/material/divider';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
    selector: 'app-facilitator-document',
    templateUrl: './facilitator-document.component.html',
    styleUrl: './facilitator-document.component.scss',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NaturalDetailHeaderComponent,
        MatButtonModule,
        RouterLink,
        MatIconModule,
        NaturalIconDirective,
        MatTabsModule,
        NaturalLinkableTabDirective,

        MatFormFieldModule,
        MatInputModule,
        NaturalFileComponent,
        MatDividerModule,
        NaturalStampComponent,
        NaturalFixedButtonDetailComponent,
    ],
})
export class FacilitatorDocumentComponent extends NaturalAbstractDetail<
    FacilitatorDocumentsService,
    NaturalSeoResolveData
> {
    public constructor(
        public readonly facilitatorDocumentService: FacilitatorDocumentsService,
        private readonly fileService: FilesService,
    ) {
        super('facilitatorDocument', facilitatorDocumentService);
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
}
