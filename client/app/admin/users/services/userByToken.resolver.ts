import {inject} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {last, Observable} from 'rxjs';
import {ErrorService} from '@ecodev/natural';
import {UserByTokenResolve} from '../user';
import {UserService} from './user.service';

export function resolveUserByToken(route: ActivatedRouteSnapshot): Observable<UserByTokenResolve> {
    const userService = inject(UserService);
    const errorService = inject(ErrorService);
    const observable = userService.resolveByToken(route.params.token).pipe(last());

    return errorService.redirectIfError(observable);
}
