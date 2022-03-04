import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {ErrorService} from '../../../shared/components/error/error.service';
import {ProductResolve} from '../product';
import {ProductService} from './product.service';

@Injectable({
    providedIn: 'root',
})
export class ProductResolver implements Resolve<ProductResolve> {
    public constructor(private readonly productService: ProductService, private readonly errorService: ErrorService) {}

    /**
     * Resolve product data for router
     */
    public resolve(route: ActivatedRouteSnapshot): Observable<ProductResolve> {
        const observable = this.productService.resolve(route.params.productId);

        return this.errorService.redirectIfError(observable);
    }
}
