import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ErrorService } from '../../../shared/components/error/error.service';
import { ProductTags_productTags_items } from '../../../shared/generated-types';
import { ProductTagService } from './product-tag.service';

@Injectable({
    providedIn: 'root',
})
export class ProductTagByNameResolver implements Resolve<{ model: ProductTags_productTags_items }> {

    constructor(private productTagService: ProductTagService,
                private errorService: ErrorService) {
    }

    /**
     * Resolve productTag data for router and panels service
     */
    public resolve(route: ActivatedRouteSnapshot): Observable<{ model: ProductTags_productTags_items }> {
        const observable = this.productTagService.resolveByName(route.params.productTagName);

        return this.errorService.redirectIfError(observable);
    }
}
