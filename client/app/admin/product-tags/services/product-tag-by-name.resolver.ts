import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {last, Observable} from 'rxjs';
import {ErrorService} from '../../../shared/components/error/error.service';
import {ProductTags} from '../../../shared/generated-types';
import {ProductTagService} from './product-tag.service';

export interface ProductTagByNameResolve {
    model: ProductTags['productTags']['items'][0];
}

@Injectable({
    providedIn: 'root',
})
export class ProductTagByNameResolver implements Resolve<ProductTagByNameResolve> {
    public constructor(
        private readonly productTagService: ProductTagService,
        private readonly errorService: ErrorService,
    ) {}

    /**
     * Resolve productTag data for router
     */
    public resolve(route: ActivatedRouteSnapshot): Observable<ProductTagByNameResolve> {
        const observable = this.productTagService.resolveByName(route.params.productTagName).pipe(last());

        return this.errorService.redirectIfError(observable);
    }
}
