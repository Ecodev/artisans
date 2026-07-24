import {Injectable} from '@angular/core';
import {NaturalAbstractModelService} from '@ecodev/natural';
import {
    type CreateFacilitatorDocument,
    type CreateFacilitatorDocumentVariables,
    type DeleteFacilitatorDocuments,
    type DeleteFacilitatorDocumentsVariables,
    type FacilitatorDocumentInput,
    type FacilitatorDocumentQuery,
    type FacilitatorDocumentQueryVariables,
    type FacilitatorDocumentsQuery,
    type FacilitatorDocumentsQueryVariables,
    type UpdateFacilitatorDocument,
    type UpdateFacilitatorDocumentVariables,
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
