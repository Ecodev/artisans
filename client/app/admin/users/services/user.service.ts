import { Injectable } from '@angular/core';
import { FormControl, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormAsyncValidators, FormValidators, Literal, NaturalAbstractModelService, NaturalValidators } from '@ecodev/natural';
import { Apollo } from 'apollo-angular';
import { DataProxy } from 'apollo-cache';
import gql from 'graphql-tag';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartService } from '../../../front-office/modules/cart/services/cart.service';
import {
    CreateUser,
    CreateUserVariables,
    CurrentUserForProfile,
    Login,
    LoginVariables,
    Logout,
    NextUserCode,
    Unregister,
    UnregisterVariables,
    UpdateUser,
    UpdateUserVariables,
    User,
    UserByToken,
    UserByTokenVariables,
    UserInput,
    UserRole,
    Users,
    UsersVariables,
    UserVariables,
} from '../../../shared/generated-types';
import { PermissionsService } from '../../../shared/services/permissions.service';
import {
    createUser,
    currentUserForProfileQuery,
    loginMutation,
    logoutMutation,
    nextCodeAvailableQuery,
    unregisterMutation,
    updateUser,
    userByTokenQuery,
    userQuery,
    usersQuery,
} from './user.queries';

export function LoginValidatorFn(control: FormControl): ValidationErrors | null {
    const value = control.value || '';
    if (!value.match(/^[a-zA-Z0-9\\.-]+$/)) {
        return {
            invalid: 'Le login doit contenir seulement des lettres, chiffres, "." et "-"',
        };
    }

    return null;
}

@Injectable({
    providedIn: 'root',
})
export class UserService extends NaturalAbstractModelService<User['user'],
    UserVariables,
    Users['users'],
    UsersVariables,
    CreateUser['createUser'],
    CreateUserVariables,
    UpdateUser['updateUser'],
    UpdateUserVariables,
    any> {

    /**
     * Should be used only by getViewer and cacheViewer
     */
    private viewerCache: CurrentUserForProfile['viewer'] | null = null;

    constructor(apollo: Apollo,
                protected router: Router,
                private permissionsService: PermissionsService) {
        super(apollo,
            'user',
            userQuery,
            usersQuery,
            createUser,
            updateUser,
            null);
    }

    public static canAccessAdmin(user: CurrentUserForProfile['viewer']): boolean {
        if (!user) {
            return false;
        }
        return [UserRole.facilitator, UserRole.administrator].includes(user.role);
    }

    protected getDefaultForServer(): UserInput {
        return {
            login: '',
            email: null,
            firstName: '',
            lastName: '',
            street: '',
            postcode: '',
            locality: '',
            role: UserRole.member,
            phone: '',
            code: null,
            url: '',
            internalRemarks: '',
            owner: null,
            membershipBegin: null,
            membershipEnd: null,
            subscriptionBegin: null,
            subscriptionType: null,
            webTemporaryAccess: false,
        };
    }

    protected getDefaultForClient(): Literal {
        return {};
    }

    public getFormValidators(): FormValidators {
        return {
            login: [Validators.required, LoginValidatorFn],
            firstName: [Validators.required, Validators.maxLength(100)],
            lastName: [Validators.required, Validators.maxLength(100)],
            email: [Validators.email],
            familyRelationship: [Validators.required],
            birthday: [Validators.required],
        };
    }

    public getFormAsyncValidators(): FormAsyncValidators {
        return {
            code: [NaturalValidators.unique('code', this)],
        };
    }

    public login(loginData: LoginVariables): Observable<Login['login']> {

        const subject = new Subject<Login['login']>();

        // Be sure to destroy all Apollo data, before changing user
        (this.apollo.getClient().resetStore() as Promise<null>).then(() => {

            this.apollo.mutate<Login, LoginVariables>({
                mutation: loginMutation,
                variables: loginData,
                update: (proxy: DataProxy, {data: {login}}) => {

                    this.cacheViewer(login);

                    // Inject the freshly logged in user as the current user into Apollo data store
                    const data = {viewer: login};
                    proxy.writeQuery({
                        query: currentUserForProfileQuery,
                        data,
                    });
                    this.permissionsService.setUser(login);

                    // Be sure that we don't have leftovers from another user
                    CartService.globalCart.empty();
                },
            }).pipe(map(({data: {login}}) => login)).subscribe(subject);
        });

        return subject;
    }

    public logout(): Observable<Logout['logout']> {
        const subject = new Subject<Logout['logout']>();

        this.router.navigate(['/login'], {queryParams: {logout: true}}).then(() => {
            this.apollo.mutate<Logout>({
                mutation: logoutMutation,
            }).pipe(map(({data: {logout}}) => logout)).subscribe((v) => {
                this.cacheViewer(null);
                (this.apollo.getClient().resetStore() as Promise<null>).then(() => {
                    subject.next(v);
                });
            });
        });

        return subject;
    }

    public getViewer(): Observable<CurrentUserForProfile['viewer']> {

        if (this.viewerCache) {
            return of(this.viewerCache);
        }

        return this.apollo.query<CurrentUserForProfile>({
            query: currentUserForProfileQuery,
        }).pipe(map(result => {
            this.cacheViewer(result.data.viewer);
            return result.data.viewer;
        }));
    }

    public getNextCodeAvailable(): Observable<number> {

        return this.apollo.query<NextUserCode>({
            query: nextCodeAvailableQuery,
        }).pipe(map(result => {
            return result.data.nextUserCode;
        }));

    }

    /**
     * This function caches the viewer for short duration
     *
     * This feature responds to two needs :
     *   - Expire viewer to allow re-resolve for key pages
     *     - Profile : in cache status or account balance has change
     *     - Doors : in case permissions have changed
     *     - Admin : in cache permissions have changed
     *
     *   - Serve from cache to prevent duplicate query calls when multiple services initialization queue (preventing batching):
     *     - Route Guards, then
     *     - Resolvers, then
     *     - Components initialization
     *
     * This is kind of easiest possible "debounce" like with expiration feature
     */
    private cacheViewer(user) {
        this.viewerCache = user;
        setTimeout(() => {
            this.viewerCache = null;
        }, 1000);
    }

    /**
     * Resolve items related to users, and the user if the id is provided, in order to show a form
     */
    public resolveViewer(): Observable<{ model: CurrentUserForProfile['viewer'] }> {
        return this.getViewer().pipe(map(result => {
            return {model: result};
        }));
    }

    public resolveByToken(token: string): Observable<{ model: UserByToken['userByToken'] }> {

        return this.apollo.query<UserByToken, UserByTokenVariables>({
            query: userByTokenQuery,
            variables: {
                token: token,
            },
        }).pipe(map(result => {
            return {model: result.data.userByToken};
        }));
    }

    public unregister(user): Observable<{ model: Unregister['unregister'] }> {
        return this.apollo.mutate<Unregister, UnregisterVariables>({
            mutation: unregisterMutation,
            variables: {
                id: user.id,
            },
        }).pipe(map(result => result.data.unregister));
    }

    /**
     * Can leave home if has an owner
     */
    public canLeaveFamily(user: CurrentUserForProfile['viewer']): boolean {

        if (!user) {
            return false;
        }

        return !!user.owner && user.owner.id !== user.id;
    }

    public requestPasswordReset(login) {
        const mutation = gql`
            mutation RequestPasswordReset($login: Login!) {
                requestPasswordReset(login: $login)
            }
        `;

        return this.apollo.mutate({
            mutation: mutation,
            variables: {
                login: login,
            },
        });
    }

}
