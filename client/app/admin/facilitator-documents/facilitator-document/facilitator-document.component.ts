import {Component, Injector, OnInit} from '@angular/core';
import {NaturalAbstractDetail} from '@ecodev/natural';
import {FilesService} from '../../files/services/files.service';
import {FacilitatorDocumentsService} from '../services/facilitator-documents.service';

@Component({
    selector: 'app-facilitator-document',
    templateUrl: './facilitator-document.component.html',
    styleUrls: ['./facilitator-document.component.scss'],
})
export class FacilitatorDocumentComponent extends NaturalAbstractDetail<FacilitatorDocumentsService> implements OnInit {
    public constructor(
        public readonly facilitatorDocumentService: FacilitatorDocumentsService,
        injector: Injector,
        public readonly fileService: FilesService,
    ) {
        super('facilitatorDocument', facilitatorDocumentService, injector);
    }

    public ngOnInit(): void {
        super.ngOnInit();
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
