import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {ErrorService} from '../../../shared/components/error/error.service';
import {ProductTagResolve} from '../productTag';
import {ProductTagService} from './product-tag.service';

@Injectable({
    providedIn: 'root',
})
export class ProductTagResolver implements Resolve<ProductTagResolve> {
    constructor(private readonly productTagService: ProductTagService, private readonly errorService: ErrorService) {}

    /**
     * Resolve productTag data for router
     */
    public resolve(route: ActivatedRouteSnapshot): Observable<ProductTagResolve> {
        const observable = this.productTagService.resolve(route.params.productTagId);

        return this.errorService.redirectIfError(observable);
    }
}
