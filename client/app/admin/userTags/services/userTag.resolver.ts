import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ErrorService } from '../../../shared/components/error/error.service';
import { UserTagService } from './userTag.service';
import { UserTagResolve } from '../userTag';

@Injectable({
    providedIn: 'root',
})
export class UserTagResolver implements Resolve<UserTagResolve> {

    constructor(private userTagService: UserTagService,
                private errorService: ErrorService) {
    }

    /**
     * Resolve userTag data for router and panels service
     */
    public resolve(route: ActivatedRouteSnapshot): Observable<UserTagResolve> {
        const observable = this.userTagService.resolve(route.params.userTagId);

        return this.errorService.redirectIfError(observable);
    }
}
