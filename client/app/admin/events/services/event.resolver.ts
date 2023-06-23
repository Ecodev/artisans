import {inject} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {last, Observable} from 'rxjs';
import {ErrorService} from '../../../shared/components/error/error.service';
import {EventResolve} from '../event';
import {EventService} from './event.service';

/**
 * Resolve product data for router
 */
export function resolveEvent(route: ActivatedRouteSnapshot): Observable<EventResolve> {
    const productService = inject(EventService);
    const errorService = inject(ErrorService);
    const observable = productService.resolve(route.params.eventId).pipe(last());

    return errorService.redirectIfError(observable);
}
