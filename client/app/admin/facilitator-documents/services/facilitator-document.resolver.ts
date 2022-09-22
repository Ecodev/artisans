import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {ErrorService} from '../../../shared/components/error/error.service';
import {FacilitatorDocumentResolve} from '../facilitator-document';
import {FacilitatorDocumentsService} from './facilitator-documents.service';

@Injectable({
    providedIn: 'root',
})
export class FacilitatorDocumentResolver implements Resolve<FacilitatorDocumentResolve> {
    public constructor(
        private readonly facilitatorDocumentService: FacilitatorDocumentsService,
        private readonly errorService: ErrorService,
    ) {}

    /**
     * Resolve facilitatorDocument data for router
     */
    public resolve(route: ActivatedRouteSnapshot): Observable<FacilitatorDocumentResolve> {
        const observable = this.facilitatorDocumentService.resolve(route.params.facilitatorDocumentId);

        return this.errorService.redirectIfError(observable);
    }
}
