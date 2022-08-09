import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {last, Observable} from 'rxjs';
import {ErrorService} from '../../../shared/components/error/error.service';
import {OrderLineResolve} from '../order-line';
import {OrderLineService} from './order-lines.service';

@Injectable({
    providedIn: 'root',
})
export class OrderLineResolver implements Resolve<OrderLineResolve> {
    public constructor(
        private readonly orderLineService: OrderLineService,
        private readonly errorService: ErrorService,
    ) {}

    /**
     * Resolve orderLine data for router
     */
    public resolve(route: ActivatedRouteSnapshot): Observable<OrderLineResolve> {
        const observable = this.orderLineService.resolve(route.params.orderLineId).pipe(last());

        return this.errorService.redirectIfError(observable);
    }
}
