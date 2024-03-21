import {inject} from '@angular/core';
import {last, Observable, switchMap} from 'rxjs';
import {ErrorService} from '../../../shared/components/error/error.service';
import {CurrentUserForProfile} from '../../../shared/generated-types';
import {UserService} from './user.service';

export function resolveViewer(): Observable<{model: CurrentUserForProfile['viewer']}> {
    const userService = inject(UserService);
    const errorService = inject(ErrorService);
    const observable = userService.resolveViewer().pipe(last());

    return errorService.redirectIfError(observable);
}

export function resolveViewerForProfile(): ReturnType<UserService['resolve']> {
    const userService = inject(UserService);
    const errorService = inject(ErrorService);
    const observable = userService.resolveViewer().pipe(switchMap(viewer => userService.resolve(viewer.model?.id)));

    return errorService.redirectIfError(observable);
}
