import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, of, Subject } from 'rxjs';
import { DataProxy } from 'apollo-cache';
import { map } from 'rxjs/operators';
import {
    FormValidators,
    FormAsyncValidators,
    Literal,
    NaturalAbstractModelService,
    NaturalFormControl,
    NaturalQueryVariablesManager,
    NaturalValidators,
} from '@ecodev/natural';
import {
    createUser,
    currentUserForProfileQuery,
    nextCodeAvailableQuery,
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
    CreateUser,
    CreateUserVariables,
    CurrentUserForProfile,
    LeaveFamily,
    LeaveFamilyVariables,
    LogicalOperator,
    Login,
    LoginVariables,
    Logout, NextUserCode,
    Relationship,
    Sex,
    SortingOrder,
    Unregister,
    UnregisterVariables,
    UpdateUser,
    UpdateUserVariables,
    User,
    UserByToken,
    UserByTokenVariables,
    UserInput,
    UserPartialInput,
    UserRole,
    Users,
    UserSortingField,
    UserStatus,
    UsersVariables,
    UserVariables,
} from '../../../shared/generated-types';
import { Router } from '@angular/router';
import { FormControl, ValidationErrors, Validators } from '@angular/forms';
import { PermissionsService } from '../../../shared/services/permissions.service';
import gql from 'graphql-tag';
import { CartService } from '../../../shop/services/cart.service';

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
                private permissionsService: PermissionsService,
                private cartService: CartService,
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
    public static getFilters(roles: UserRole[], statuses: UserStatus[] | null, withCode: boolean = false): UsersVariables {
        return {
            filter: {
                groups: [
                    {
                        conditions: [
                            {
                                role: roles && roles.length ? {in: {values: roles}} : null,
                                status: statuses ? {in: {values: statuses}} : null,
                                code: withCode ? {null: {not: true}} : null,
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
        return [UserRole.product, UserRole.responsible, UserRole.administrator].includes(user.role);
    }

    public static canAccessAccounting(user: CurrentUserForProfile['viewer']): boolean {
        if (!user) {
            return false;
        }
        return [UserRole.responsible, UserRole.administrator].includes(user.role);
    }

    public static canAccessUsers(user: CurrentUserForProfile['viewer']): boolean {
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

    public static getFamilyVariables(user): UsersVariables {

        const familyBoss = user.owner || user;

        return {
            filter: {
                groups: [
                    {conditions: [{id: {equal: {value: familyBoss.id}}}]},
                    {
                        groupLogic: LogicalOperator.OR,
                        conditions: [{owner: {equal: {value: familyBoss.id}}}],
                    },
                ],
            },
            sorting: [{field: UserSortingField.birthday, order: SortingOrder.ASC}],
        };
    }

    protected getDefaultForServer(): UserInput {
        return {
            login: '',
            email: null,
            firstName: '',
            lastName: '',
            birthday: null,
            street: '',
            postcode: '',
            locality: '',
            status: UserStatus.new,
            role: UserRole.member,
            familyRelationship: Relationship.householder,
            mobilePhone: '',
            phone: '',
            door: false,
            code: null,
            companyShares: 0,
            companySharesDate: null,
            url: '',
            billingType: BillingType.electronic,
            remarks: '',
            internalRemarks: '',
            owner: null,
            sex: Sex.not_known,
            welcomeSessionDate: null,
            iban: '',
            receivesNewsletter: true,
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

    public getFormConfig(model: Literal): Literal {
        const config = super.getFormConfig(model);

        // Inject extra form control for the account which is strictly read-only
        const formState = {
            value: model.account,
            disabled: true,
        };
        config.account = new NaturalFormControl(formState);

        return config;
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
                    this.cartService.empty();
                },
            }).pipe(map(({data: {login}}) => login)).subscribe(subject);
        });

        return subject;
    }

    public flagWelcomeSessionDate(id: string, value = (new Date()).toISOString()) {
        const user: UserPartialInput = {welcomeSessionDate: value};
        return this.updatePartially({id: id, ...user});
    }

    public activate(id: string) {
        const user: UserPartialInput = {status: UserStatus.active};
        return this.updatePartially({id: id, ...user});
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

        const isMember = [UserRole.member, UserRole.product, UserRole.responsible, UserRole.administrator].indexOf(user.role) > -1;

        return !isMember && !this.canLeaveFamily(user);
    }

    public canUpdateTransaction(user: CurrentUserForProfile['viewer']): boolean {
        if (!user) {
            return false;
        }
        return user.role === UserRole.administrator;
    }

    public canDeleteAccountingDocument(user: CurrentUserForProfile['viewer']): boolean {
        if (!user) {
            return false;
        }
        return user.role === UserRole.administrator;
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

    /**
     * Get all members of the user family
     */
    public getFamily(user: CurrentUserForProfile['viewer']) {
        const qvm = new NaturalQueryVariablesManager<UsersVariables>();
        qvm.set('variables', UserService.getFamilyVariables(user));

        return this.getAll(qvm);
    }
}
