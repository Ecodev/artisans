import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {last, Observable} from 'rxjs';
import {ErrorService} from '../../../shared/components/error/error.service';
import {CurrentUserForProfile} from '../../../shared/generated-types';
import {UserService} from './user.service';

@Injectable({
    providedIn: 'root',
})
export class ViewerResolver implements Resolve<{model: CurrentUserForProfile['viewer']}> {
    public constructor(private readonly userService: UserService, private readonly errorService: ErrorService) {}

    /**
     * Resolve sites for routing service only at the moment
     */
    public resolve(): Observable<{model: CurrentUserForProfile['viewer']}> {
        const observable = this.userService.resolveViewer().pipe(last());

        return this.errorService.redirectIfError(observable);
    }
}
