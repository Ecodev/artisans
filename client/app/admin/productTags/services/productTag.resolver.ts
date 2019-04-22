import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ErrorService } from '../../../shared/components/error/error.service';
import { ProductTagService } from './productTag.service';
import { ProductTagResolve } from '../productTag';

@Injectable({
    providedIn: 'root',
})
export class ProductTagResolver implements Resolve<ProductTagResolve> {

    constructor(private productTagService: ProductTagService,
                private errorService: ErrorService) {
    }

    /**
     * Resolve productTag data for router and panels service
     */
    public resolve(route: ActivatedRouteSnapshot): Observable<ProductTagResolve> {
        const observable = this.productTagService.resolve(route.params.productTagId);

        return this.errorService.redirectIfError(observable);
    }
}
