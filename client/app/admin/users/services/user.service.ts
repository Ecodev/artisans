import {gql} from 'apollo-angular';
import {inject, Injectable, OnDestroy} from '@angular/core';
import {Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {
    deliverableEmail,
    FormAsyncValidators,
    FormValidators,
    LOCAL_STORAGE,
    NaturalAbstractModelService,
    unique,
} from '@ecodev/natural';
import {fromEvent, Observable, of, Subject, switchMap, tap} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';
import {UpToDateSubject} from '../../../shared/classes/up-to-date-subject';
import {
    ConfirmRegistration,
    ConfirmRegistrationVariables,
    CreateUser,
    CreateUserVariables,
    CurrentUserForProfile,
    DeleteUsers,
    DeleteUsersVariables,
    Login,
    LoginVariables,
    Logout,
    RequestMembershipEnd,
    RequestPasswordReset,
    RequestPasswordResetVariables,
    SubscribeNewsletter,
    SubscribeNewsletterVariables,
    UpdateUser,
    UpdateUserVariables,
    User,
    UserByToken,
    UserByTokenVariables,
    UserInput,
    UserRole,
    UserRolesAvailables,
    UserRolesAvailablesVariables,
    Users,
    UsersVariables,
    UserVariables,
} from '../../../shared/generated-types';
import {CurrencyService} from '../../../shared/services/currency.service';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {
    createUser,
    currentUserForProfileQuery,
    deleteUsers,
    loginMutation,
    logoutMutation,
    updateUser,
    userByTokenQuery,
    userQuery,
    userRolesAvailableQuery,
    usersQuery,
} from './user.queries';
import {CartCollectionService} from '../../../front-office/modules/cart/services/cart-collection.service';
import {DOCUMENT} from '@angular/common';

export type UserLike = User['user'] | NonNullable<CurrentUserForProfile['viewer']>;

@Injectable({
    providedIn: 'root',
})
export class UserService
    extends NaturalAbstractModelService<
        User['user'],
        UserVariables,
        Users['users'],
        UsersVariables,
        CreateUser['createUser'],
        CreateUserVariables,
        UpdateUser['updateUser'],
        UpdateUserVariables,
        DeleteUsers,
        DeleteUsersVariables
    >
    implements OnDestroy
{
    protected readonly router = inject(Router);
    private readonly permissionsService = inject(PermissionsService);
    private readonly currencyService = inject(CurrencyService);
    private readonly cartCollectionService = inject(CartCollectionService);
    private readonly document = inject(DOCUMENT);
    private readonly storage = inject(LOCAL_STORAGE);

    /**
     * Should be used only by fetchViewer and cacheViewer
     */
    private readonly viewer = new UpToDateSubject<CurrentUserForProfile['viewer']>(null);

    /**
     * This key will be used to store the viewer ID, but that value should never
     * be trusted, and it only exists to notify changes across browser tabs.
     */
    private readonly storageKey = 'viewer';
    private readonly onDestroy = new Subject<void>();

    public constructor() {
        super('user', userQuery, usersQuery, createUser, updateUser, deleteUsers);
        this.keepViewerSyncedAcrossBrowserTabs();
    }

    public static canAccessAdmin(user: CurrentUserForProfile['viewer']): boolean {
        if (!user) {
            return false;
        }
        return [UserRole.administrator].includes(user.role);
    }

    public static canAccessFacilitatorPrivate(user: CurrentUserForProfile['viewer']): boolean {
        if (!user) {
            return false;
        }
        return [UserRole.facilitator, UserRole.administrator].includes(user.role);
    }

    public override getFormValidators(): FormValidators {
        return {
            firstName: [Validators.required, Validators.maxLength(100)],
            lastName: [Validators.required, Validators.maxLength(100)],
            email: [deliverableEmail],
            locality: [Validators.required],
            street: [Validators.required],
            postcode: [Validators.required],
            country: [Validators.required],
            membership: [], // Inject field that cannot be mutated, but should be displayed
        };
    }

    public override getFormAsyncValidators(model: User['user']): FormAsyncValidators {
        return {
            email: [unique('email', model.id, this)],
        };
    }

    public ngOnDestroy(): void {
        this.onDestroy.next();
        this.onDestroy.complete();
    }

    private keepViewerSyncedAcrossBrowserTabs(): void {
        const window = this.document.defaultView;
        if (!window) {
            return;
        }

        fromEvent<StorageEvent>(window, 'storage')
            .pipe(takeUntil(this.onDestroy))
            .subscribe(event => {
                if (event.key !== this.storageKey) {
                    return;
                }

                // Don't do anything if the event comes from the current browser tab
                if (window.document.hasFocus()) {
                    return;
                }

                this.refetchViewerAndGoToHome().subscribe();
            });
    }

    private refetchViewerAndGoToHome(homeUrl = '/'): Observable<unknown> {
        return this.fetchViewer().pipe(
            tap(viewer => {
                if (viewer) {
                    this.apollo.client.resetStore().then(() => {
                        this.postLogin(viewer);

                        // Navigate away from login page
                        this.router.navigateByUrl(homeUrl);
                    });
                } else {
                    this.logout();
                }
            }),
        );
    }

    public login(loginData: LoginVariables): Observable<Login['login']> {
        const subject = new Subject<Login['login']>();

        // Be sure to destroy all Apollo data, before changing user
        this.apollo.client.resetStore().then(() => {
            this.apollo
                .mutate<Login, LoginVariables>({
                    mutation: loginMutation,
                    variables: loginData,
                })
                .pipe(
                    map(result => {
                        const viewer = result.data!.login;
                        this.postLogin(viewer);

                        return viewer;
                    }),
                )
                .subscribe(subject);
        });

        return subject;
    }

    public confirmRegistration(variables: ConfirmRegistrationVariables): Observable<unknown> {
        const mutation = gql`
            mutation ConfirmRegistration($token: Token!, $input: ConfirmRegistrationInput!) {
                confirmRegistration(token: $token, input: $input)
            }
        `;

        return this.apollo
            .mutate<ConfirmRegistration, ConfirmRegistrationVariables>({
                mutation: mutation,
                variables: variables,
            })
            .pipe(switchMap(() => this.refetchViewerAndGoToHome('/mon-compte')));
    }

    private postLogin(viewer: NonNullable<CurrentUserForProfile['viewer']>): void {
        this.viewer.next(viewer);

        // Inject the freshly logged in user as the current user into Apollo data store
        const data = {viewer: viewer};
        this.apollo.client.writeQuery<CurrentUserForProfile, never>({
            query: currentUserForProfileQuery,
            data,
        });

        this.permissionsService.setUser(viewer);

        this.currencyService.updateLockedStatus(viewer);

        // Broadcast viewer to other browser tabs
        this.storage.setItem(this.storageKey, viewer.id);
    }

    public logout(): Observable<Logout['logout']> {
        const subject = new Subject<Logout['logout']>();

        this.naturalDebounceService
            .flush()
            .pipe(
                switchMap(() => this.router.navigate(['/login'], {queryParams: {logout: true}})),
                switchMap(() =>
                    this.apollo.mutate<Logout>({
                        mutation: logoutMutation,
                    }),
                ),
            )
            .subscribe(result => {
                const v = result.data!.logout;

                // Be sure that we don't have leftovers from another user
                this.cartCollectionService.clear();
                this.viewer.next(null);
                this.currencyService.updateLockedStatus(null);

                // Broadcast logout to other browser tabs
                this.storage.setItem(this.storageKey, '');

                this.apollo.client.resetStore().then(() => {
                    subject.next(v);
                    subject.complete();
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

    public getUserRolesAvailable(user: User['user'] | UserInput | null): Observable<UserRole[]> {
        return this.apollo
            .query<UserRolesAvailables, UserRolesAvailablesVariables>({
                query: userRolesAvailableQuery,
                variables: {
                    user: user && 'id' in user ? user.id : undefined,
                },
            })
            .pipe(
                map(result => {
                    return result.data.userRolesAvailable;
                }),
            );
    }

    /**
     *
     * @param expirationTolerance If provided, return cached viewer more recently than the given delay in ms
     */
    public getViewerValue(expirationTolerance?: number): CurrentUserForProfile['viewer'] {
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
    public resolveViewer(): Observable<CurrentUserForProfile['viewer']> {
        return this.fetchViewer(1000).pipe(
            map(result => {
                this.currencyService.updateLockedStatus(result);

                return result;
            }),
        );
    }

    public resolveByToken(token: string): Observable<UserByToken['userByToken']> {
        return this.apollo
            .query<UserByToken, UserByTokenVariables>({
                query: userByTokenQuery,
                variables: {
                    token: token,
                },
            })
            .pipe(map(result => result.data.userByToken));
    }

    public requestPasswordReset(email: string): Observable<RequestPasswordReset['requestPasswordReset']> {
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
            .pipe(map(result => result.data!.requestPasswordReset));
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
            .pipe(map(result => result.data!.requestMembershipEnd));
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
                    email: email,
                },
            })
            .pipe(map(result => result.data!.subscribeNewsletter));
    }

    public override getDefaultForServer(): UserInput {
        return {
            email: '',
            firstName: '',
            lastName: '',
            street: '',
            postcode: '',
            locality: '',
            role: UserRole.member,
            phone: '',
            owner: null,
            country: null,
            isPublicFacilitator: false,
        };
    }
}
