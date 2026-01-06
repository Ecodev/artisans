import {Injectable} from '@angular/core';
import {NaturalAbstractModelService} from '@ecodev/natural';
import {
    CreateFacilitatorDocument,
    CreateFacilitatorDocumentVariables,
    DeleteFacilitatorDocuments,
    DeleteFacilitatorDocumentsVariables,
    FacilitatorDocumentInput,
    FacilitatorDocumentQuery,
    FacilitatorDocumentQueryVariables,
    FacilitatorDocumentsQuery,
    FacilitatorDocumentsQueryVariables,
    UpdateFacilitatorDocument,
    UpdateFacilitatorDocumentVariables,
} from '../../../shared/generated-types';
import {
    createFacilitatorDocument,
    deleteFacilitatorDocuments,
    facilitatorDocumentQuery,
    facilitatorDocumentsQuery,
    updateFacilitatorDocument,
} from './facilitator-documents.queries';

@Injectable({
    providedIn: 'root',
})
export class FacilitatorDocumentsService extends NaturalAbstractModelService<
    FacilitatorDocumentQuery['facilitatorDocument'],
    FacilitatorDocumentQueryVariables,
    FacilitatorDocumentsQuery['facilitatorDocuments'],
    FacilitatorDocumentsQueryVariables,
    CreateFacilitatorDocument['createFacilitatorDocument'],
    CreateFacilitatorDocumentVariables,
    UpdateFacilitatorDocument['updateFacilitatorDocument'],
    UpdateFacilitatorDocumentVariables,
    DeleteFacilitatorDocuments,
    DeleteFacilitatorDocumentsVariables
> {
    public constructor() {
        super(
            'facilitatorDocument',
            facilitatorDocumentQuery,
            facilitatorDocumentsQuery,
            createFacilitatorDocument,
            updateFacilitatorDocument,
            deleteFacilitatorDocuments,
        );
    }

    public override getDefaultForServer(): FacilitatorDocumentInput {
        return {
            name: '',
            file: null,
            category: '',
        };
    }
}
