import {inject} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {last} from 'rxjs';
import {ErrorService} from '../../../shared/components/error/error.service';
import {OrderLineService} from './order-lines.service';

/**
 * Resolve orderLine data for router
 */
export function resolveOrderLine(route: ActivatedRouteSnapshot): ReturnType<OrderLineService['resolve']> {
    const orderLineService = inject(OrderLineService);
    const errorService = inject(ErrorService);
    const observable = orderLineService.resolve(route.params.orderLineId).pipe(last());

    return errorService.redirectIfError(observable);
}
