import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {UserService} from '../../admin/users/services/user.service';

/**
 * Return if route is allowed or not considering the authenticated user.
 * Used by routing service.
 */
export function canActivateAdministration(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
): Observable<boolean> {
    const router = inject(Router);
    const userService = inject(UserService);
    return userService.resolveViewer().pipe(
        map(user => {
            const granted = UserService.canAccessAdmin(user);

            if (!granted) {
                router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
                return false;
            }

            return true;
        }),
    );
}
