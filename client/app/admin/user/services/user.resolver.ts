import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { CurrentUserForProfileQuery } from '../../../shared/generated-types';
import { UserService } from './user.service';
import { ErrorService } from '../../../shared/components/error/error.service';

@Injectable({
    providedIn: 'root',
})
export class UserResolver implements Resolve<CurrentUserForProfileQuery['viewer']> {

    constructor(private userService: UserService,
                private errorService: ErrorService) {
    }

    /**
     * Resolve sites for routing service only at the moment
     */
    public resolve(route: ActivatedRouteSnapshot): Observable<CurrentUserForProfileQuery['viewer']> {
        const observable = this.userService.resolve();

        return this.errorService.redirectIfError(observable);
    }

}
