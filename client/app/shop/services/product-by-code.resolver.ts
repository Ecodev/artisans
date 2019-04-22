import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductResolve } from '../../admin/products/product';
import { ProductService } from '../../admin/products/services/product.service';
import { ErrorService } from '../../shared/components/error/error.service';

@Injectable({
    providedIn: 'root',
})
export class ProductByCodeResolver implements Resolve<ProductResolve> {

    constructor(private productService: ProductService,
                private errorService: ErrorService) {
    }

    /**
     * Resolve product data for router and panels service
     */
    public resolve(route: ActivatedRouteSnapshot): Observable<ProductResolve> {
        const observable = this.productService.resolveByCode(route.params.code);

        return this.errorService.redirectIfError(observable);
    }
}
