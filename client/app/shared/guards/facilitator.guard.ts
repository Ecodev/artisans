import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {UserService} from '../../admin/users/services/user.service';

@Injectable({
    providedIn: 'root',
})
export class FacilitatorGuard implements CanActivate {
    public constructor(private readonly router: Router, private readonly userService: UserService) {}

    /**
     * Return if route is allowed or not considering the authenticated user.
     * Used by routing service.
     */
    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.userService.resolveViewer().pipe(
            map(user => {
                const granted = UserService.canAccessFacilitatorPrivate(user.model);

                if (!granted) {
                    this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
                    return false;
                }

                return true;
            }),
        );
    }
}
