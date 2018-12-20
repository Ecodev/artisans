import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, of, Subject } from 'rxjs';
import { DataProxy } from 'apollo-cache';
import { map } from 'rxjs/operators';
import { pick } from 'lodash';
import { AbstractModelService, FormValidators } from '../../../shared/services/abstract-model.service';
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
    BookingType,
    CreateUserMutation,
    CreateUserMutationVariables,
    CurrentUserForProfileQuery,
    LoginMutation,
    LoginMutationVariables,
    LogoutMutation,
    Relationship,
    UpdateUserMutation,
    UpdateUserMutationVariables,
    UserInput,
    UserQuery,
    UserQueryVariables,
    UserRole,
    UsersQuery,
    UsersQueryVariables,
} from '../../../shared/generated-types';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { Literal } from '../../../shared/types';

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

    /**
     * TODO : define criters that explicits a member is active
     */
    public static readonly membersQueryVariables: UsersQueryVariables = {
        filter: {
            groups: [
                {
                    conditions: [
                        {
                            responsible: {null: {not: false}},
                            welcomeSessionDate: {null: {not: true}},
                            role: {in: {values: [UserRole.member]}},
                        },
                    ],
                    joins: {bookings: {joins: {bookables: {conditions: [{bookingType: {equal: {value: BookingType.mandatory}}}]}}}},
                },
            ],
        },
    };

    /**
     * TODO : define all criters that explicits a member is fresh
     */
    public static readonly freshMembersQueryVariables: UsersQueryVariables = {
        filter: {
            groups: [
                {
                    conditions: [
                        {
                            responsible: {null: {not: false}},
                            welcomeSessionDate: {null: {not: false}},
                            role: {in: {values: [UserRole.inactive]}},
                        },
                    ],
                    joins: {bookings: {joins: {bookables: {conditions: [{bookingType: {equal: {value: BookingType.mandatory}}}]}}}},
                },
            ],
        },
    };

    private currentUser: CurrentUserForProfileQuery['viewer'] | null = null;

    public static checkPassword(formGroup: FormGroup): Literal | null {
        if (!formGroup) {
            return null;
        }

        const pass = formGroup.controls.password.value;
        const confirmPass = formGroup.controls.confirmPassword.value;

        return pass === confirmPass ? null : {notSame: true};
    }

    constructor(apollo: Apollo, private router: Router) {
        super(apollo,
            'user',
            userQuery,
            usersQuery,
            createUserMutation,
            updateUserMutation,
            null);
    }

    public getEmptyObject(): UserInput {
        return {
            login: '',
            password: '',
            email: '',
            name: '',
            birthday: null,
            street: '',
            postcode: '',
            locality: '',
            country: null,
            familyRelationship: Relationship.householder,
            // role: UserRole.inactive : // TODO : cannot by set by anonymous, but should be
        };
    }

    public getDefaultValues(): Literal {
        return {
            country: {id: 1, name: 'Suisse'},
        };
    }

    public getFormValidators(): FormValidators {
        return {
            name: [Validators.required, Validators.maxLength(100)],
            login: [Validators.required],
            email: [Validators.required],
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

}
