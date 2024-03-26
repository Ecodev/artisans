import {inject} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {ErrorService} from '../../../shared/components/error/error.service';
import {FacilitatorDocumentsService} from './facilitator-documents.service';

/**
 * Resolve facilitatorDocument data for router
 */
export function resolveFacilitatorDocument(
    route: ActivatedRouteSnapshot,
): ReturnType<FacilitatorDocumentsService['resolve']> {
    const facilitatorDocumentService = inject(FacilitatorDocumentsService);
    const errorService = inject(ErrorService);
    const observable = facilitatorDocumentService.resolve(route.params.facilitatorDocumentId);

    return errorService.redirectIfError(observable);
}
