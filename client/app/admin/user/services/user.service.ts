import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, of, Subject } from 'rxjs';
import { DataProxy } from 'apollo-cache';
import { map } from 'rxjs/operators';
import { pick } from 'lodash';
import { AbstractModelService } from '../../../shared/services/abstract-model.service';
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
    CreateUserMutation,
    CreateUserMutationVariables,
    CurrentUserForProfileQuery,
    LoginMutation,
    LoginMutationVariables,
    LogoutMutation,
    UpdateUserMutation,
    UpdateUserMutationVariables,
    UserInput,
    UserQuery,
    UserQueryVariables,
    UsersQuery,
    UsersQueryVariables,
} from '../../../shared/generated-types';
import { Router } from '@angular/router';

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

    private currentUser: CurrentUserForProfileQuery['viewer'] | null = null;

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
