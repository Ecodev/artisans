import {inject} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {last, Observable} from 'rxjs';
import {ErrorService} from '../../../shared/components/error/error.service';
import {OrderResolve} from '../order';
import {OrderService} from './order.service';

/**
 * Resolve order data for router
 */
export function resolveOrder(route: ActivatedRouteSnapshot): Observable<OrderResolve> {
    const orderService = inject(OrderService);
    const errorService = inject(ErrorService);

    const observable = orderService.resolve(route.params.orderId).pipe(last());

    return errorService.redirectIfError(observable);
}
