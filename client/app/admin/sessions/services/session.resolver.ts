import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {last, Observable} from 'rxjs';
import {ErrorService} from '../../../shared/components/error/error.service';
import {SessionResolve} from '../session';
import {SessionService} from './session.service';

@Injectable({
    providedIn: 'root',
})
export class SessionResolver implements Resolve<SessionResolve> {
    public constructor(private readonly sessionService: SessionService, private readonly errorService: ErrorService) {}

    /**
     * Resolve session data for router
     */
    public resolve(route: ActivatedRouteSnapshot): Observable<SessionResolve> {
        const observable = this.sessionService.resolve(route.params.sessionId).pipe(last());

        return this.errorService.redirectIfError(observable);
    }
}
