import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductResolve } from '../product';
import { ErrorService } from '../../../shared/components/error/error.service';
import { ProductService } from './product.service';

@Injectable({
    providedIn: 'root',
})
export class ProductResolver implements Resolve<ProductResolve> {

    constructor(private productService: ProductService,
                private errorService: ErrorService) {
    }

    /**
     * Resolve product data for router and panels service
     */
    public resolve(route: ActivatedRouteSnapshot): Observable<ProductResolve> {
        const observable = this.productService.resolve(route.params.productId);

        return this.errorService.redirectIfError(observable);
    }
}