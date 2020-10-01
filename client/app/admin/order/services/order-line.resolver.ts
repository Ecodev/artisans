import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {ErrorService} from '../../../shared/components/error/error.service';
import {OrderLineResolve} from '../order-line';
import {OrderLineService} from './order-lines.service';

@Injectable({
    providedIn: 'root',
})
export class OrderLineResolver implements Resolve<OrderLineResolve> {
    constructor(private orderLineService: OrderLineService, private errorService: ErrorService) {}

    /**
     * Resolve orderLine data for router
     */
    public resolve(route: ActivatedRouteSnapshot): Observable<OrderLineResolve> {
        const observable = this.orderLineService.resolve(route.params.orderLineId);

        return this.errorService.redirectIfError(observable);
    }
}
