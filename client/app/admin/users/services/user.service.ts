import {Injectable} from '@angular/core';
import {Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {FormAsyncValidators, FormValidators, NaturalAbstractModelService} from '@ecodev/natural';
import {Apollo} from 'apollo-angular';
import {DataProxy} from 'apollo-cache';
import gql from 'graphql-tag';
import {Observable, of, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {CartService} from '../../../front-office/modules/cart/services/cart.service';
import {CurrencyService} from '../../../shared/services/currency.service';
import {UpToDateSubject} from '../../../shared/classes/up-to-date-subject';
import {
    CreateUser,
    CreateUserVariables,
    CurrentUserForProfile,
    CurrentUserForProfile_viewer,
    Login,
    LoginVariables,
    Logout,
    RequestMembershipEnd,
    RequestPasswordReset,
    RequestPasswordResetVariables,
    SubscribeNewsletter,
    SubscribeNewsletterVariables,
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
import {PermissionsService} from '../../../shared/services/permissions.service';
import {
    createUser,
    currentUserForProfileQuery,
    deleteUsers,
    loginMutation,
    logoutMutation,
    unregisterMutation,
    updateUser,
    userByTokenQuery,
    userQuery,
    usersQuery,
} from './user.queries';

export type UserLike = User_user | CurrentUserForProfile_viewer;

@Injectable({
    providedIn: 'root',
})
export class UserService extends NaturalAbstractModelService<
    User['user'],
    UserVariables,
    Users['users'],
    UsersVariables,
    CreateUser['createUser'],
    CreateUserVariables,
    UpdateUser['updateUser'],
    UpdateUserVariables,
    any
> {
    /**
     * Should be used only by fetchViewer and cacheViewer
     */
    private readonly viewer = new UpToDateSubject<CurrentUserForProfile['viewer']>(null);

    constructor(
        apollo: Apollo,
        protected router: Router,
        private permissionsService: PermissionsService,
        private currencyService: CurrencyService,
        private cartService: CartService,
    ) {
        super(apollo, 'user', userQuery, usersQuery, createUser, updateUser, deleteUsers);
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
            membership: [], // Inject field that cannot be mutated, but should be displayed
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
            this.apollo
                .mutate<Login, LoginVariables>({
                    mutation: loginMutation,
                    variables: loginData,
                    update: (proxy: DataProxy, result) => {
                        const login = (result.data as Login).login;
                        this.viewer.next(login);

                        // Inject the freshly logged in user as the current user into Apollo data store
                        const data = {viewer: login};
                        proxy.writeQuery({query: currentUserForProfileQuery, data});
                        this.permissionsService.setUser(login);

                        // Be sure that we don't have leftovers from another user
                        this.cartService.clearCarts();
                        this.currencyService.updateLockedStatus(login);
                    },
                })
                .pipe(map(result => (result.data as Login).login))
                .subscribe(subject);
        });

        return subject;
    }

    public logout(): Observable<Logout['logout']> {
        const subject = new Subject<Logout['logout']>();

        this.router.navigate(['/login'], {queryParams: {logout: true}}).then(() => {
            this.apollo
                .mutate<Logout>({
                    mutation: logoutMutation,
                })
                .subscribe(result => {
                    const v = (result.data as Logout).logout;

                    this.viewer.next(null);
                    this.currencyService.updateLockedStatus(null);
                    (this.apollo.getClient().resetStore() as Promise<null>).then(() => {
                        subject.next(v);
                    });
                });
        });

        return subject;
    }

    /**
     * Returns the current viewer from server or from cache as a one shot observable.
     *
     * @param expirationTolerance If provided, return cached viewer if it has been fetched more recently than the given delay in ms
     */
    public fetchViewer(expirationTolerance?: number): Observable<CurrentUserForProfile['viewer']> {
        const viewer = this.getViewerValue(expirationTolerance);

        if (viewer) {
            return of(viewer);
        }

        return this.apollo
            .query<CurrentUserForProfile>({
                query: currentUserForProfileQuery,
            })
            .pipe(
                map(result => {
                    this.viewer.next(result.data.viewer);
                    return result.data.viewer;
                }),
            );
    }

    /**
     *
     * @param expirationTolerance If provided, return cached viewer more recently than the given delay in ms
     */
    public getViewerValue(expirationTolerance?: number) {
        return this.viewer.getUpToDateValue(expirationTolerance || 0);
    }

    /**
     * Return observable that emits on changes about the viewer.
     *
     * Each refetch from the **server** update the viewer. "Refetches" from cache don't update the viewer
     */
    public getViewerObservable(): Observable<CurrentUserForProfile['viewer']> {
        return this.viewer.asObservable();
    }

    /**
     * Resolve items related to users, and the user if the id is provided, in order to show a form
     */
    public resolveViewer(): Observable<{model: CurrentUserForProfile['viewer']}> {
        return this.fetchViewer(1000).pipe(
            map(result => {
                this.currencyService.updateLockedStatus(result);
                return {model: result};
            }),
        );
    }

    public resolveByToken(token: string): Observable<{model: UserByToken['userByToken']}> {
        return this.apollo
            .query<UserByToken, UserByTokenVariables>({
                query: userByTokenQuery,
                variables: {
                    token: token,
                },
            })
            .pipe(
                map(result => {
                    return {model: result.data.userByToken};
                }),
            );
    }

    public unregister(user): Observable<Unregister['unregister']> {
        return this.apollo
            .mutate<Unregister, UnregisterVariables>({
                mutation: unregisterMutation,
                variables: {
                    id: user.id,
                },
            })
            .pipe(map(result => (result.data as Unregister).unregister));
    }

    public requestPasswordReset(email): Observable<RequestPasswordReset['requestPasswordReset']> {
        const mutation = gql`
            mutation RequestPasswordReset($email: Email!) {
                requestPasswordReset(email: $email)
            }
        `;

        return this.apollo
            .mutate<RequestPasswordReset, RequestPasswordResetVariables>({
                mutation: mutation,
                variables: {
                    email: email,
                },
            })
            .pipe(map(result => (result.data as RequestPasswordReset).requestPasswordReset));
    }

    public requestMembershipEnd(): Observable<RequestMembershipEnd['requestMembershipEnd']> {
        const mutation = gql`
            mutation RequestMembershipEnd {
                requestMembershipEnd
            }
        `;

        return this.apollo
            .mutate<RequestMembershipEnd, never>({
                mutation: mutation,
            })
            .pipe(map(result => (result.data as RequestMembershipEnd).requestMembershipEnd));
    }

    public subscribeNewsletter(email: string): Observable<SubscribeNewsletter['subscribeNewsletter']> {
        const mutation = gql`
            mutation SubscribeNewsletter($email: Email!) {
                subscribeNewsletter(email: $email)
            }
        `;

        return this.apollo
            .mutate<SubscribeNewsletter, SubscribeNewsletterVariables>({
                mutation: mutation,
                variables: {
                    email,
                },
            })
            .pipe(map(result => (result.data as SubscribeNewsletter).subscribeNewsletter));
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
            owner: null,
            country: null,
        };
    }
}
