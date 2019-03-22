import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { debounceTime, distinctUntilChanged, filter, skip, take } from 'rxjs/operators';
import { isEqual } from 'lodash';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { PermissionsQuery } from '../generated-types';
import { Literal } from '../types';

const permissionsQuery = gql`
    query Permissions {
        permissions {
            crud {
                account { create }
                accountingDocument { create }
                bookable { create }
                bookableMetadata { create }
                bookableTag { create }
                booking { create }
                country { create }
                expenseClaim { create }
                image { create }
                license { create }
                message { create }
                transaction { create }
                transactionTag { create }
                user { create }
                userTag { create }
            }
        }
    }
`;

interface Contexts {
    user: string | null;
}

export type Permissions = PermissionsQuery['permissions'];

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
    public crud: Permissions['crud'] | null = null;

    /**
     * Observable of changed permissions. Here we use a ReplaySubject so that new subscriber will get
     * the most recent available permissions (useful in route guard)
     */
    public changes = new ReplaySubject<Permissions>(1);

    private readonly currentContexts = new BehaviorSubject<Contexts>({
        user: null,
    });

    constructor(apollo: Apollo) {
        // Query the API when our variables changed
        this.currentContexts.pipe(distinctUntilChanged(isEqual), debounceTime(5)).subscribe(contexts => {
            // Fetch global permissions
            apollo.query<PermissionsQuery>({
                query: permissionsQuery,
            }).pipe(filter(result => !result.loading)).subscribe(result => {
                this.crud = result.data.permissions.crud;
                this.changes.next(result.data.permissions);
            });
        });
    }


    /**
     * Return an observable that will complete as soon as the next permissions are available
     */
    private setNewContexts(newContexts: Contexts): Observable<Permissions> {
        if (isEqual(this.currentContexts.value, newContexts) && this.crud) {
            return of({crud: this.crud});
        } else {
            this.currentContexts.next(newContexts);

            return this.changes.pipe(skip(1), take(1));
        }
    }

    public setUser(user: Literal | null): Observable<Permissions> {
        const newContexts = {
            user: user ? user.id : null,
        };

        return this.setNewContexts(newContexts);
    }

}
