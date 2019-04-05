import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, of, Subject } from 'rxjs';
import { DataProxy } from 'apollo-cache';
import { map } from 'rxjs/operators';
import { pick } from 'lodash';
import { AbstractModelService, AutoRefetchQueryRef, FormValidators } from '../../../shared/services/abstract-model.service';
import {
    createUser,
    currentUserForProfileQuery,
    leaveFamilyMutation,
    loginMutation,
    logoutMutation,
    unregisterMutation,
    updateUser,
    userByTokenQuery,
    userQuery,
    usersQuery,
} from './user.queries';
import {
    BillingType,
    Bookings,
    BookingsVariables,
    BookingStatus,
    BookingType,
    CreateUser,
    CreateUserVariables,
    CurrentUserForProfile,
    LeaveFamily,
    LeaveFamilyVariables,
    Login,
    LoginVariables,
    Logout,
    Relationship,
    Sex,
    Unregister,
    UnregisterVariables,
    UpdateUser,
    UpdateUserVariables,
    UserByToken,
    UserByTokenVariables,
    UserInput,
    User,
    UserVariables,
    UserRole,
    Users,
    UsersVariables,
    UserStatus,
} from '../../../shared/generated-types';
import { Router } from '@angular/router';
import { FormControl, ValidationErrors, Validators } from '@angular/forms';
import { Literal } from '../../../shared/types';
import { QueryVariablesManager } from '../../../shared/classes/query-variables-manager';
import { BookingService } from '../../bookings/services/booking.service';
import { ExtendedFormControl } from '../../../shared/classes/ExtendedFormControl';
import { PermissionsService } from '../../../shared/services/permissions.service';
import gql from 'graphql-tag';

@Injectable({
    providedIn: 'root',
})
export class UserService extends AbstractModelService<User['user'],
    UserVariables,
    Users['users'],
    UsersVariables,
    CreateUser['createUser'],
    CreateUserVariables,
    UpdateUser['updateUser'],
    UpdateUserVariables,
    any> {

    private currentUser: CurrentUserForProfile['viewer'] | null = null;

    constructor(apollo: Apollo,
                protected router: Router,
                protected bookingService: BookingService,
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

    /**
     * Return filters for users for given roles and statuses
     */
    public static getFilters(roles: UserRole[], statuses: UserStatus[] | null): UsersVariables {
        return {
            filter: {
                groups: [
                    {
                        conditions: [
                            {
                                role: roles && roles.length ? {in: {values: roles}} : null,
                                status: statuses ? {in: {values: statuses}} : null,
                            },
                        ],
                    },
                ],
            },
        };
    }

    public static canAccessAdmin(user: CurrentUserForProfile['viewer']): boolean {
        if (!user) {
            return false;
        }
        return [UserRole.responsible, UserRole.administrator].includes(user.role);
    }

    public static canAccessDoor(user: CurrentUserForProfile['viewer']): boolean {
        if (!user) {
            return false;
        }
        return user.canOpenDoor;
    }

    public getEmptyObject(): UserInput {
        return {
            login: '',
            email: '',
            firstName: '',
            lastName: '',
            birthday: null,
            street: '',
            postcode: '',
            locality: '',
            country: null,
            status: UserStatus.new,
            role: UserRole.member,
            familyRelationship: Relationship.householder,
            swissSailing: '',
            swissSailingType: null,
            swissWindsurfType: null,
            mobilePhone: '',
            phone: '',
            door1: false,
            door2: false,
            door3: false,
            door4: false,
            billingType: BillingType.electronic,
            remarks: '',
            internalRemarks: '',
            owner: null,
            sex: Sex.not_known,
            welcomeSessionDate: null,
            iban: '',
        };
    }

    public getDefaultValues(): Literal {
        return {
            country: {id: 1, name: 'Suisse'},
        };
    }

    public getFormValidators(): FormValidators {
        return {
            login: [
                Validators.required, (control: FormControl): ValidationErrors | null => {
                    const value = control.value || '';
                    if (!value.match(/^[a-zA-Z0-9\\.-]+$/)) {
                        return {
                            invalid: 'Le login doit contenir seulement des lettres, chiffres, "." et "-"',
                        };
                    }

                    return null;
                },
            ],
            firstName: [Validators.required, Validators.maxLength(100)],
            lastName: [Validators.required, Validators.maxLength(100)],
            email: [Validators.required, Validators.email],
            familyRelationship: [Validators.required],
        };
    }

    public getFormConfig(model: Literal): Literal {
        const config = super.getFormConfig(model);

        // Inject extra form control for the account which is strictly read-only
        const formState = {
            value: model.account,
            disabled: true,
        };
        config.account = new ExtendedFormControl(formState);

        return config;
    }

    public getCurrentUser(): Observable<CurrentUserForProfile['viewer']> {

        if (this.currentUser) {
            return of(this.currentUser);
        }

        return this.apollo.query<CurrentUserForProfile>({
            query: currentUserForProfileQuery,
        }).pipe(map(result => {
            this.currentUser = result.data.viewer;

            return this.currentUser;
        }));
    }

    public getCachedCurrentUser(): CurrentUserForProfile['viewer'] {
        return this.currentUser;
    }

    public login(loginData: LoginVariables): Observable<Login['login']> {

        const subject = new Subject<Login['login']>();

        // Be sure to destroy all Apollo data, before changing user
        (this.apollo.getClient().resetStore() as Promise<null>).then(() => {

            this.apollo.mutate<Login, LoginVariables>({
                mutation: loginMutation,
                variables: loginData,
                update: (proxy: DataProxy, {data: {login}}) => {

                    this.currentUser = login;

                    // Inject the freshly logged in user as the current user into Apollo data store
                    const data = {viewer: login};
                    proxy.writeQuery({
                        query: currentUserForProfileQuery,
                        data,
                    });
                    this.permissionsService.setUser(this.currentUser);
                },
            }).pipe(map(({data: {login}}) => login)).subscribe(subject);
        });

        return subject;
    }

    /**
     * Todo : create specific mutation endpoint to flag current date on welcomeSessionDate and if user has paid, active him
     */
    // public flagWelcomeSessionDate(id: string): Observable<UpdateUser['updateUser']> {
    // }

    public logout(): Observable<Logout['logout']> {
        const subject = new Subject<Logout['logout']>();

        this.router.navigate(['/login'], {queryParams: {logout: true}}).then(() => {
            this.apollo.mutate<Logout>({
                mutation: logoutMutation,
            }).pipe(map(({data: {logout}}) => logout)).subscribe((v) => {
                this.currentUser = null;
                (this.apollo.getClient().resetStore() as Promise<null>).then(() => {
                    subject.next(v);
                });
            });
        });

        return subject;
    }

    /**
     * Resolve items related to users, and the user if the id is provided, in order to show a form
     */
    public resolveViewer(): Observable<any> {
        return this.getCurrentUser().pipe(map(result => {
            return {model: result};
        }));
    }

    /**
     * Impact members
     */
    public getRunningServices(user): AutoRefetchQueryRef<Bookings['bookings']> {
        const variables: BookingsVariables = {
            filter: {
                groups: [
                    {
                        conditions: [
                            {
                                owner: {equal: {value: user.id}},
                                status: {equal: {value: BookingStatus.booked}},
                                endDate: {null: {}}
                            },
                        ],
                        joins: {
                            bookable: {
                                conditions: [
                                    {
                                        bookingType: {
                                            in: {
                                                values: [BookingType.self_approved],
                                                not: true,
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                ],
            },
        };

        const qvm = new QueryVariablesManager<BookingsVariables>();
        qvm.set('variables', variables);
        return this.bookingService.watchAll(qvm, true);
    }

    public getPendingApplications(user): AutoRefetchQueryRef<Bookings['bookings']> {
        const variables: BookingsVariables = {
            filter: {
                groups: [
                    {
                        conditions: [
                            {
                                endDate: {null: {}},
                                owner: {equal: {value: user.id}},
                                status: {equal: {value: BookingStatus.application}},
                            },
                        ],
                        joins: {bookable: {conditions: [{bookingType: {in: {values: [BookingType.admin_approved]}}}]}},
                    },
                ],
            },
        };

        const qvm = new QueryVariablesManager<BookingsVariables>();
        qvm.set('variables', variables);
        return this.bookingService.watchAll(qvm, true);
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

    public leaveFamily(user): Observable<{ model: LeaveFamily['leaveFamily'] }> {
        return this.apollo.mutate<LeaveFamily, LeaveFamilyVariables>({
            mutation: leaveFamilyMutation,
            variables: {
                id: user.id,
            },
        }).pipe(map(result => result.data.leaveFamily));
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

    /**
     * Can become a member has no owner and is not member
     */
    public canBecomeMember(user: CurrentUserForProfile['viewer']): boolean {

        if (!user) {
            return false;
        }

        const isMember = [UserRole.member, UserRole.responsible, UserRole.administrator].indexOf(user.role) > -1;

        return !isMember && !this.canLeaveFamily(user);
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
