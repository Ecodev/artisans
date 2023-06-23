import {inject} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {last, Observable} from 'rxjs';
import {ErrorService} from '../../../shared/components/error/error.service';
import {SessionResolve} from '../session';
import {SessionService} from './session.service';

/**
 * Resolve session data for router
 */
export function resolveSession(route: ActivatedRouteSnapshot): Observable<SessionResolve> {
    const sessionService = inject(SessionService);
    const errorService = inject(ErrorService);
    const observable = sessionService.resolve(route.params.sessionId).pipe(last());

    return errorService.redirectIfError(observable);
}
