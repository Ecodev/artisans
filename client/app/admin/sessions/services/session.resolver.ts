import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {ErrorService} from '../../../shared/components/error/error.service';
import {SessionResolve} from '../session';
import {SessionService} from './session.service';

@Injectable({
    providedIn: 'root',
})
export class SessionResolver implements Resolve<SessionResolve> {
    constructor(private sessionService: SessionService, private errorService: ErrorService) {}

    /**
     * Resolve session data for router and panels service
     */
    public resolve(route: ActivatedRouteSnapshot): Observable<SessionResolve> {
        const observable = this.sessionService.resolve(route.params.sessionId);

        return this.errorService.redirectIfError(observable);
    }
}
