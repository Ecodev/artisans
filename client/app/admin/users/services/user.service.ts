import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, of, Subject } from 'rxjs';
import { DataProxy } from 'apollo-cache';
import { map } from 'rxjs/operators';
import { pick } from 'lodash';
import { AbstractModelService, AutoRefetchQueryRef, FormValidators } from '../../../shared/services/abstract-model.service';
import {
    createUserMutation,
    currentUserForProfileQuery,
    loginMutation,
    logoutMutation,
    updateUserMutation,
    userQuery,
    usersQuery,
} from './user.queries';
import {
    BookingsQuery,
    BookingsQueryVariables,
    BookingStatus,
    BookingType,
    CreateUserMutation,
    CreateUserMutationVariables,
    CurrentUserForProfileQuery,
    LoginMutation,
    LoginMutationVariables,
    LogoutMutation,
    Relationship,
    Sex,
    UpdateUserMutation,
    UpdateUserMutationVariables,
    UserInput,
    UserQuery,
    UserQueryVariables,
    UserRole,
    UsersQuery,
    UsersQueryVariables,
    UserStatus,
} from '../../../shared/generated-types';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Literal } from '../../../shared/types';
import { QueryVariablesManager } from '../../../shared/classes/query-variables-manager';
import { BookingService } from '../../bookings/services/booking.service';
import { ErrorStateMatcher } from '@angular/material';

@Injectable({
    providedIn: 'root',
})
export class UserService extends AbstractModelService<UserQuery['user'],
    UserQueryVariables,
    UsersQuery['users'],
    UsersQueryVariables,
    CreateUserMutation['createUser'],
    CreateUserMutationVariables,
    UpdateUserMutation['updateUser'],
    UpdateUserMutationVariables,
    any> {

    public static readonly nonActivesMembersQueryVariables: UsersQueryVariables = {
        filter: {
            groups: [
                {
                    conditions: [
                        {
                            responsible: {null: {not: false}},
                            status: {in: {values: [UserStatus.inactive, UserStatus.new, UserStatus.archived]}},
                        },
                    ],
                },
            ],
        },
    };

    private currentUser: CurrentUserForProfileQuery['viewer'] | null = null;

    constructor(apollo: Apollo, protected router: Router, protected bookingService: BookingService) {
        super(apollo,
            'user',
            userQuery,
            usersQuery,
            createUserMutation,
            updateUserMutation,
            null);
    }

    /**
     * Return filters for users with or without responsible for given roles
     */
    public static getFiltersByRoleAndResponsible(roles: UserRole[], withResponsible: boolean = false): UsersQueryVariables {
        return {
            filter: {
                groups: [
                    {
                        conditions: [
                            {

                                responsible: {null: {not: withResponsible}},
                                role: roles && roles.length ? {in: {values: roles}} : null,
                                status: {equal: {value: UserStatus.active}},
                            },
                        ],
                    },
                ],
            },
        };
    }

    /**
     * Return filters for users with or without responsible for given statuses
     */
    public static getFiltersByStatusAndResponsible(status: UserStatus[], withResponsible: boolean = false): UsersQueryVariables {
        return {
            filter: {
                groups: [
                    {
                        conditions: [
                            {
                                responsible: {null: {not: withResponsible}},
                                status: {in: {values: status}},
                            },
                        ],
                    },
                ],
            },
        };
    }

    public static checkPassword(formGroup: FormGroup): Literal | null {
        if (!formGroup) {
            return null;
        }

        const pass = formGroup.controls.password.value;
        const confirmPass = formGroup.controls.confirmPassword.value;

        return pass === confirmPass ? null : {notSame: true};
    }

    public static canAccessAdmin(user: CurrentUserForProfileQuery['viewer']) {
        if (!user) {
            return false;
        }
        return [UserRole.responsible, UserRole.administrator].indexOf(user.role) > -1;
    }

    public getEmptyObject(): UserInput {
        return {
            login: '',
            password: '',
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
            ichtusSwissSailing: '',
            mobilePhone: '',
            phone: '',
            door1: false,
            door2: false,
            door3: false,
            door4: false,
            account: null,
            billingType: '',
            remarks: '',
            responsible: null,
            sex: Sex.not_known,
            welcomeSessionDate: null,
        };
    }

    public getDefaultValues(): Literal {
        return {
            country: {id: 1, name: 'Suisse'},
        };
    }

    public getFormValidators(): FormValidators {
        return {
            firstName: [Validators.required, Validators.maxLength(100)],
            lastName: [Validators.required, Validators.maxLength(100)],
            login: [Validators.required],
            email: [Validators.required],
            familyRelationship: [Validators.required],
        };
    }

    public getCurrentUser(): Observable<CurrentUserForProfileQuery['viewer']> {

        if (this.currentUser) {
            return of(this.currentUser);
        }

        return this.apollo.query<CurrentUserForProfileQuery>({
            query: currentUserForProfileQuery,
        }).pipe(map(result => {
            this.currentUser = result.data.viewer;

            return this.currentUser;
        }));
    }

    public login(loginData: LoginMutationVariables): Observable<LoginMutation['login']> {

        const subject = new Subject<LoginMutation['login']>();

        // Be sure to destroy all Apollo data, before changing user
        (this.apollo.getClient().resetStore() as Promise<null>).then(() => {

            this.apollo.mutate<LoginMutation, LoginMutationVariables>({
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
                },
            }).pipe(map(({data: {login}}) => login)).subscribe(subject);
        });

        return subject;
    }

    /**
     * Todo : create specific mutation endpoint to flag current date on welcomeSessionDate and if user has paid, active him
     */
    // public flagWelcomeSessionDate(id: string): Observable<UpdateUserMutation['updateUser']> {
    // }

    public logout(): Observable<LogoutMutation['logout']> {
        const subject = new Subject<LogoutMutation['logout']>();

        this.router.navigate(['/login'], {queryParams: {logout: true}}).then(() => {
            this.apollo.mutate<LogoutMutation>({
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
     * Carnet de sorties (sorties en cours)
     */
    public getRunningNavigations(user): AutoRefetchQueryRef<BookingsQuery['bookings']> {
        const variables: BookingsQueryVariables = {
            filter: {
                groups: [
                    {
                        conditions: [{responsible: {equal: {value: user.id}}}],
                        joins: {bookables: {conditions: [{bookingType: {in: {values: [BookingType.self_approved]}}}]}},
                    },
                ],
            },
        };

        const qvm = new QueryVariablesManager<BookingsQueryVariables>();
        qvm.set('variables', variables);
        return this.bookingService.watchAll(qvm, true);
    }

    /**
     * Impact members
     */
    public getRunningServices(user): AutoRefetchQueryRef<BookingsQuery['bookings']> {
        const variables: BookingsQueryVariables = {
            filter: {
                groups: [
                    {
                        conditions: [
                            {
                                responsible: {equal: {value: user.id}},
                                status: {equal: {value: BookingStatus.booked}},
                            },
                        ],
                        joins: {bookables: {conditions: [{bookingType: {in: {values: [BookingType.self_approved], not: true}}}]}},
                    },
                ],
            },
        };

        const qvm = new QueryVariablesManager<BookingsQueryVariables>();
        qvm.set('variables', variables);
        return this.bookingService.watchAll(qvm, true);
    }

    public getPendingApplications(user): AutoRefetchQueryRef<BookingsQuery['bookings']> {
        const variables: BookingsQueryVariables = {
            filter: {
                groups: [
                    {
                        conditions: [
                            {
                                responsible: {equal: {value: user.id}},
                                status: {equal: {value: BookingStatus.application}},
                            },
                        ],
                        joins: {bookables: {conditions: [{bookingType: {in: {values: [BookingType.admin_approved]}}}]}},
                    },
                ],
            },
        };

        const qvm = new QueryVariablesManager<BookingsQueryVariables>();
        qvm.set('variables', variables);
        return this.bookingService.watchAll(qvm, true);
    }

}

export class ConfirmPasswordStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {

        if (control && control.parent && control.parent instanceof FormGroup) {
            return !!UserService.checkPassword(control.parent) && control.dirty;
        }

        return false;
    }
}
