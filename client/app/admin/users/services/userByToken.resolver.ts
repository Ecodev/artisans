import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ErrorService } from '../../../shared/components/error/error.service';
import { UserByToken } from '../../../shared/generated-types';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root',
})
export class UserByTokenResolver implements Resolve<{ model: UserByToken['userByToken'] }> {

    constructor(private userService: UserService,
                private errorService: ErrorService) {
    }

    /**
     * Resolve sites for routing service only at the moment
     */
    public resolve(route: ActivatedRouteSnapshot): Observable<{ model: UserByToken['userByToken'] }> {
        const observable = this.userService.resolveByToken(route.params.token);

        return this.errorService.redirectIfError(observable);
    }

}
