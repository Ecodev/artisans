import {inject} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {last, Observable} from 'rxjs';
import {ErrorService} from '../../../shared/components/error/error.service';
import {UserByTokenResolve} from '../user';
import {UserService} from './user.service';

/**
 * Resolve sites for routing service only at the moment
 */
export function resolveUserByToken(route: ActivatedRouteSnapshot): Observable<UserByTokenResolve> {
    const userService = inject(UserService);
    const errorService = inject(ErrorService);
    const observable = userService.resolveByToken(route.params.token).pipe(last());

    return errorService.redirectIfError(observable);
}
