import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { OrderResolve } from '../order';
import { ErrorService } from '../../shared/components/error/error.service';
import { OrderService } from './order.service';

@Injectable({
    providedIn: 'root',
})
export class OrderResolver implements Resolve<OrderResolve> {

    constructor(private orderService: OrderService,
                private errorService: ErrorService) {
    }

    /**
     * Resolve order data for router and panels service
     */
    public resolve(route: ActivatedRouteSnapshot): Observable<OrderResolve> {
        let observable;

        if (route.params.orderId) {
            observable = this.orderService.resolve(route.params.orderId);
        } else if (route.params.transactionId) {
            observable = this.orderService.resolveByTransaction(route.params.transactionId);
        }

        return this.errorService.redirectIfError(observable);
    }
}
