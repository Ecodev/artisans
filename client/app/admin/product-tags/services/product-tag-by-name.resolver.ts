import {inject} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {last, Observable} from 'rxjs';
import {ErrorService} from '../../../shared/components/error/error.service';
import {ProductTags} from '../../../shared/generated-types';
import {ProductTagService} from './product-tag.service';

export interface ProductTagByNameResolve {
    model: ProductTags['productTags']['items'][0];
}

/**
 * Resolve productTag data for router
 */
export function resolveProductTagByName(route: ActivatedRouteSnapshot): Observable<ProductTagByNameResolve> {
    const productTagService = inject(ProductTagService);
    const errorService = inject(ErrorService);
    const observable = productTagService.resolveByName(route.params.productTagName).pipe(last());

    return errorService.redirectIfError(observable);
}
