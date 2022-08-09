import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {last, Observable} from 'rxjs';
import {ErrorService} from '../../../shared/components/error/error.service';
import {OrderResolve} from '../order';
import {OrderService} from './order.service';

@Injectable({
    providedIn: 'root',
})
export class OrderResolver implements Resolve<OrderResolve> {
    public constructor(private readonly orderService: OrderService, private readonly errorService: ErrorService) {}

    /**
     * Resolve order data for router
     */
    public resolve(route: ActivatedRouteSnapshot): Observable<OrderResolve> {
        const observable = this.orderService.resolve(route.params.orderId).pipe(last());

        return this.errorService.redirectIfError(observable);
    }
}
