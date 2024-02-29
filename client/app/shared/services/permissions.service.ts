import {Apollo} from 'apollo-angular';
import {Injectable} from '@angular/core';
import {Literal} from '@ecodev/natural';
import {isEqual} from 'lodash-es';
import {BehaviorSubject, Observable, of, ReplaySubject} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, skip, take} from 'rxjs/operators';
import {Permissions} from '../generated-types';
import {permissionsQuery} from './permissions.queries';

type Contexts = {
    user: string | null;
};

/**
 * A service to fetch permissions and use them in templates.
 *
 * Current site and state will be automatically taken into account when they change.
 * The other contexts must be set manually, when available, to get correct permissions.
 */
@Injectable({
    providedIn: 'root',
})
export class PermissionsService {
    /**
     * CRUD permissions, usually for object creations
     */
    public crud: Permissions['permissions']['crud'] | null = null;

    /**
     * Observable of changed permissions. Here we use a ReplaySubject so that new subscriber will get
     * the most recent available permissions (useful in route guard)
     */
    public changes = new ReplaySubject<Permissions['permissions']>(1);

    private readonly currentContexts = new BehaviorSubject<Contexts>({
        user: null,
    });

    public constructor(apollo: Apollo) {
        // Query the API when our variables changed
        this.currentContexts.pipe(distinctUntilChanged(isEqual), debounceTime(5)).subscribe(() => {
            // Fetch global permissions
            apollo
                .query<Permissions>({
                    query: permissionsQuery,
                })
                .pipe(filter(result => !result.loading))
                .subscribe(result => {
                    this.crud = result.data.permissions.crud;
                    this.changes.next(result.data.permissions);
                });
        });
    }

    public setUser(user: Literal | null): Observable<Permissions['permissions']> {
        const newContexts = {
            user: user ? user.id : null,
        };

        return this.setNewContexts(newContexts);
    }

    /**
     * Return an observable that will complete as soon as the next permissions are available
     */
    private setNewContexts(newContexts: Contexts): Observable<Permissions['permissions']> {
        if (isEqual(this.currentContexts.value, newContexts) && this.crud) {
            return of({
                __typename: 'AllPermissions',
                crud: this.crud,
            });
        } else {
            this.currentContexts.next(newContexts);

            return this.changes.pipe(skip(1), take(1));
        }
    }
}
