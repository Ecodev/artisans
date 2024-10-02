import {Apollo} from 'apollo-angular';
import {Injectable, inject} from '@angular/core';
import {Literal} from '@ecodev/natural';
import {BehaviorSubject, Observable} from 'rxjs';
import {concatMap, debounceTime, distinctUntilChanged, filter, map, shareReplay} from 'rxjs/operators';
import {Permissions} from '../generated-types';
import {isEqual} from 'lodash-es';
import {permissionsQuery} from './permissions.queries';

type Contexts = {
    user: string | null;
};

/**
 * A service to fetch permissions and use them in templates.
 */
@Injectable({
    providedIn: 'root',
})
export class PermissionsService {
    /**
     * Observable of CRUD permissions, usually for object creations
     */
    public readonly crud: Observable<Permissions['permissions']['crud']>;

    /**
     * Observable of changed permissions
     */
    public readonly changes: Observable<Permissions['permissions']>;

    private readonly currentContexts = new BehaviorSubject<Contexts>({
        user: null,
    });

    public constructor() {
        const apollo = inject(Apollo);

        // Query the API whenever our variables change
        const fetch = this.currentContexts.pipe(
            distinctUntilChanged(isEqual),
            debounceTime(5),
            concatMap(() =>
                apollo.query<Permissions>({query: permissionsQuery}).pipe(filter(result => !result.loading)),
            ),
            shareReplay(), // new subscriber will get the most recent available permissions
        );

        this.crud = fetch.pipe(map(result => result.data.permissions.crud));
        this.changes = fetch.pipe(map(result => result.data.permissions));
    }

    /**
     * Return an observable that will complete as soon as the next permissions are available
     */
    private setNewContexts(newContexts: Contexts): void {
        this.currentContexts.next(newContexts);
    }

    public setUser(user: Literal | null): void {
        const newContexts = {
            user: user ? user.id : null,
        };

        this.setNewContexts(newContexts);
    }
}
