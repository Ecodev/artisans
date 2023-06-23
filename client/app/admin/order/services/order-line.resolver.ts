import {inject} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {last, Observable} from 'rxjs';
import {ErrorService} from '../../../shared/components/error/error.service';
import {OrderLineResolve} from '../order-line';
import {OrderLineService} from './order-lines.service';

/**
 * Resolve orderLine data for router
 */
export function resolveOrderLine(route: ActivatedRouteSnapshot): Observable<OrderLineResolve> {
    const orderLineService = inject(OrderLineService);
    const errorService = inject(ErrorService);
    const observable = orderLineService.resolve(route.params.orderLineId).pipe(last());

    return errorService.redirectIfError(observable);
}
