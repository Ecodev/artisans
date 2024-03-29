import {inject} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {last} from 'rxjs';
import {ErrorService} from '../../../shared/components/error/error.service';
import {EventService} from './event.service';

/**
 * Resolve product data for router
 */
export function resolveEvent(route: ActivatedRouteSnapshot): ReturnType<EventService['resolve']> {
    const productService = inject(EventService);
    const errorService = inject(ErrorService);
    const observable = productService.resolve(route.params.eventId).pipe(last());

    return errorService.redirectIfError(observable);
}
