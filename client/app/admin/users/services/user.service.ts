import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormAsyncValidators, FormValidators, Literal, NaturalAbstractModelService } from '@ecodev/natural';
import { Apollo } from 'apollo-angular';
import { DataProxy } from 'apollo-cache';
import gql from 'graphql-tag';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartService } from '../../../front-office/modules/cart/services/cart.service';
import { CurrencyManager } from '../../../shared/classes/currencyManager';
import {
    CreateUser,
    CreateUserVariables,
    CurrentUserForProfile,
    CurrentUserForProfile_viewer,
    Login,
    LoginVariables,
    Logout,
    NextUserCode,
    RequestMembershipEnd,
    RequestPasswordReset,
    RequestPasswordResetVariables,
    Unregister,
    UnregisterVariables,
    UpdateUser,
    UpdateUserVariables,
    User,
    User_user,
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

export type UserLike =
    User_user
    | CurrentUserForProfile_viewer;

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
                private permissionsService: PermissionsService,
    ) {

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

    public getFormValidators(): FormValidators {
        return {
            firstName: [Validators.required, Validators.maxLength(100)],
            lastName: [Validators.required, Validators.maxLength(100)],
            email: [Validators.email],
            locality: [Validators.required],
            street: [Validators.required],
            postcode: [Validators.required],
            country: [Validators.required],
        };
    }

    public getFormAsyncValidators(model: User_user): FormAsyncValidators {
        return {
            // code: [unique('code', model.id, this)], // ?? todo : replace by e-mail ?
        };
    }

    public login(loginData: LoginVariables): Observable<Login['login']> {

        const subject = new Subject<Login['login']>();

        // Be sure to destroy all Apollo data, before changing user
        (this.apollo.getClient().resetStore() as Promise<null>).then(() => {

            this.apollo.mutate<Login, LoginVariables>({
                mutation: loginMutation,
                variables: loginData,
                update: (proxy: DataProxy, result) => {

                    const login = (result.data as Login).login;
                    this.cacheViewer(login);

                    // Inject the freshly logged in user as the current user into Apollo data store
                    const data = {viewer: login};
                    proxy.writeQuery({query: currentUserForProfileQuery, data});
                    this.permissionsService.setUser(login);

                    // Be sure that we don't have leftovers from another user
                    CartService.clearCarts();
                    CurrencyManager.updateLockedStatus(login);
                },
            }).pipe(map(result => (result.data as Login).login)).subscribe(subject);
        });

        return subject;
    }

    public logout(): Observable<Logout['logout']> {
        const subject = new Subject<Logout['logout']>();

        this.router.navigate(['/login'], {queryParams: {logout: true}}).then(() => {
            this.apollo.mutate<Logout>({
                mutation: logoutMutation,
            }).subscribe(result => {
                const v = (result.data as Logout).logout;

                this.cacheViewer(null);
                CurrencyManager.updateLockedStatus(null);
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
     * Resolve items related to users, and the user if the id is provided, in order to show a form
     */
    public resolveViewer(): Observable<{ model: CurrentUserForProfile['viewer'] }> {
        return this.getViewer().pipe(map(result => {
            CurrencyManager.updateLockedStatus(result);
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

    public unregister(user): Observable<Unregister['unregister']> {
        return this.apollo.mutate<Unregister, UnregisterVariables>({
            mutation: unregisterMutation,
            variables: {
                id: user.id,
            },
        }).pipe(map(result => (result.data as Unregister).unregister));
    }

    public requestPasswordReset(email): Observable<RequestPasswordReset['requestPasswordReset']> {
        const mutation = gql`
            mutation RequestPasswordReset($email: Email!) {
                requestPasswordReset(email: $email)
            }
        `;

        return this.apollo.mutate<RequestPasswordReset, RequestPasswordResetVariables>({
            mutation: mutation,
            variables: {
                email: email,
            },
        }).pipe(map(result => (result.data as RequestPasswordReset).requestPasswordReset));
    }

    public requestMembershipEnd(): Observable<RequestMembershipEnd['requestMembershipEnd']> {
        const mutation = gql`
            mutation RequestMembershipEnd {
                requestMembershipEnd
            }
        `;

        return this.apollo.mutate<RequestMembershipEnd, never>({
            mutation: mutation,
        }).pipe(map(result => (result.data as RequestMembershipEnd).requestMembershipEnd));
    }

    protected getDefaultForServer(): UserInput {
        return {
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
            country: null,
        };
    }

    protected getDefaultForClient(): Literal {
        return {};
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

}
