import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { StockMovementResolve } from '../stockMovement';
import { ErrorService } from '../../../shared/components/error/error.service';
import { StockMovementService } from './stockMovement.service';

@Injectable({
    providedIn: 'root',
})
export class StockMovementResolver implements Resolve<StockMovementResolve> {

    constructor(private stockMovementService: StockMovementService,
                private errorService: ErrorService) {
    }

    /**
     * Resolve stockMovement data for router and panels service
     */
    public resolve(route: ActivatedRouteSnapshot): Observable<StockMovementResolve> {
        const observable = this.stockMovementService.resolve(route.params.stockMovementId);

        return this.errorService.redirectIfError(observable);
    }
}
