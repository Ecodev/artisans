import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {ErrorService} from '../../../shared/components/error/error.service';
import {CurrentUserForProfile} from '../../../shared/generated-types';
import {UserService} from './user.service';

@Injectable({
    providedIn: 'root',
})
export class ViewerResolver implements Resolve<{model: CurrentUserForProfile['viewer']}> {
    constructor(private readonly userService: UserService, private readonly errorService: ErrorService) {}

    /**
     * Resolve sites for routing service only at the moment
     */
    public resolve(route: ActivatedRouteSnapshot): Observable<{model: CurrentUserForProfile['viewer']}> {
        const observable = this.userService.resolveViewer();

        return this.errorService.redirectIfError(observable);
    }
}
