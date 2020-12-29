import {Apollo, gql} from 'apollo-angular';
import {DataProxy} from '@apollo/client/core';
import {Injectable} from '@angular/core';
import {Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {
    deliverableEmail,
    FormAsyncValidators,
    FormValidators,
    NaturalAbstractModelService,
    unique,
} from '@ecodev/natural';
import {Observable, of, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {UpToDateSubject} from '../../../shared/classes/up-to-date-subject';
import {
    AddToMailingList,
    AddToMailingListVariables,
    CreateUser,
    CreateUserVariables,
    CurrentUserForProfile,
    CurrentUserForProfile_viewer,
    DeleteUsers,
    DeleteUsersVariables,
    Login,
    LoginVariables,
    Logout,
    RequestMembershipEnd,
    RequestPasswordReset,
    RequestPasswordResetVariables,
    UpdateUser,
    UpdateUserVariables,
    User,
    User_user,
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
    DeleteUsers,
    DeleteUsersVariables
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
        private readonly cartCollectionService: CartCollectionService,
    ) {
        super(apollo, 'user', userQuery, usersQuery, createUser, updateUser, deleteUsers);
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

    public getFormValidators(): FormValidators {
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

    public getFormAsyncValidators(model: User_user): FormAsyncValidators {
        return {
            email: [unique('email', model.id, this)],
        };
    }

    public login(loginData: LoginVariables): Observable<Login['login']> {
        const subject = new Subject<Login['login']>();

        // Be sure to destroy all Apollo data, before changing user
        (this.apollo.client.resetStore() as Promise<null>).then(() => {
            this.apollo
                .mutate<Login, LoginVariables>({
                    mutation: loginMutation,
                    variables: loginData,
                    update: (proxy: DataProxy, result) => {
                        const login = result.data!.login;
                        this.viewer.next(login);

                        // Inject the freshly logged in user as the current user into Apollo data store
                        const data = {viewer: login};
                        proxy.writeQuery({query: currentUserForProfileQuery, data});
                        this.permissionsService.setUser(login);

                        this.currencyService.updateLockedStatus(login);
                    },
                })
                .pipe(map(result => result.data!.login))
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
                    const v = result.data!.logout;

                    // Be sure that we don't have leftovers from another user
                    this.cartCollectionService.clear();
                    this.viewer.next(null);
                    this.currencyService.updateLockedStatus(null);
                    (this.apollo.client.resetStore() as Promise<null>).then(() => {
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

    public getUserRolesAvailable(user: User_user | null): Observable<UserRole[]> {
        return this.apollo
            .query<UserRolesAvailables, UserRolesAvailablesVariables>({
                query: userRolesAvailableQuery,
                variables: {
                    user: user?.id,
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
    public getViewerValue(expirationTolerance?: number): CurrentUserForProfile['viewer'] | null {
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

    public subscribeNewsletter(email: string): Observable<AddToMailingList['addToMailingList']> {
        return this.addToMailingList('55475', email);
    }

    public addToMailingList(destination: string, email: string): Observable<AddToMailingList['addToMailingList']> {
        const mutation = gql`
            mutation AddToMailingList($destination: String!, $email: String!) {
                addToMailingList(destination: $destination, email: $email)
            }
        `;

        return this.apollo
            .mutate<AddToMailingList, AddToMailingListVariables>({
                mutation: mutation,
                variables: {
                    destination: destination,
                    email: email,
                },
            })
            .pipe(map(result => result.data!.addToMailingList));
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
            isPublicFacilitator: false,
        };
    }
}
