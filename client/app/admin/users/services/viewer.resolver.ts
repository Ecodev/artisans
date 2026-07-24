import {inject} from '@angular/core';
import {last, type Observable, switchMap} from 'rxjs';
import {ErrorService} from '@ecodev/natural';
import {type CurrentUserForProfileQuery} from '../../../shared/generated-types';
import {UserService} from './user.service';

export function resolveViewer(): Observable<CurrentUserForProfileQuery['viewer']> {
    const userService = inject(UserService);
    const errorService = inject(ErrorService);
    const observable = userService.resolveViewer().pipe(last());

    return errorService.redirectIfError(observable);
}

export function resolveViewerForProfile(): ReturnType<UserService['resolve']> {
    const userService = inject(UserService);
    const errorService = inject(ErrorService);
    const observable = userService.resolveViewer().pipe(switchMap(viewer => userService.resolve(viewer?.id)));

    return errorService.redirectIfError(observable);
}
