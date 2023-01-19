import {Component, Injector} from '@angular/core';
import {NaturalAbstractDetail} from '@ecodev/natural';
import {FilesService} from '../../files/services/files.service';
import {FacilitatorDocumentsService} from '../services/facilitator-documents.service';
import {CreateFile_createFile} from '../../../shared/generated-types';
import {map, Observable, of, switchMap} from 'rxjs';

@Component({
    selector: 'app-facilitator-document',
    templateUrl: './facilitator-document.component.html',
    styleUrls: ['./facilitator-document.component.scss'],
})
export class FacilitatorDocumentComponent extends NaturalAbstractDetail<FacilitatorDocumentsService> {
    public constructor(
        public readonly facilitatorDocumentService: FacilitatorDocumentsService,
        injector: Injector,
        private readonly fileService: FilesService,
    ) {
        super('facilitatorDocument', facilitatorDocumentService, injector);
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
}
