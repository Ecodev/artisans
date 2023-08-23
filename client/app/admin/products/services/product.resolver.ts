import {inject} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {last} from 'rxjs';
import {ErrorService} from '../../../shared/components/error/error.service';
import {ProductService} from './product.service';

/**
 * Resolve product data for router
 */
export function resolveProduct(route: ActivatedRouteSnapshot): ReturnType<ProductService['resolve']> {
    const productService = inject(ProductService);
    const errorService = inject(ErrorService);
    const observable = productService.resolve(route.params.productId).pipe(last());

    return errorService.redirectIfError(observable);
}
