import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { BookableResolve } from '../../admin/bookables/bookable';
import { BookableService } from '../../admin/bookables/services/bookable.service';
import { ErrorService } from '../../shared/components/error/error.service';

@Injectable({
    providedIn: 'root',
})
export class BookableByCodeResolver implements Resolve<BookableResolve> {

    constructor(private bookableService: BookableService,
                private errorService: ErrorService) {
    }

    /**
     * Resolve bookable data for router and panels service
     */
    public resolve(route: ActivatedRouteSnapshot): Observable<BookableResolve> {
        const observable = this.bookableService.resolveByCode(route.params.bookableCode);

        return this.errorService.redirectIfError(observable);
    }
}
