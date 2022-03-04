import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {ErrorService} from '../../../shared/components/error/error.service';
import {ProductTags_productTags_items} from '../../../shared/generated-types';
import {ProductTagService} from './product-tag.service';

export interface ProductTagByNameResolve {
    model: ProductTags_productTags_items;
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
        const observable = this.productTagService.resolveByName(route.params.productTagName);

        return this.errorService.redirectIfError(observable);
    }
}
