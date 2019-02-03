import { Component, OnInit } from '@angular/core';
import { AbstractDetail } from '../../../admin/shared/components/AbstractDetail';
import {
    CreateUserMutation,
    CreateUserMutationVariables,
    UpdateUserMutation,
    UpdateUserMutationVariables,
    UserQuery,
    UserQueryVariables,
} from '../../../shared/generated-types';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BookableService } from '../../../admin/bookables/services/bookable.service';
import { AppDataSource } from '../../../shared/services/data.source';
import { ConfirmPasswordStateMatcher } from '../../../admin/users/services/user.service';
import { AnonymousUserService } from './anonymous-user.service';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { pick } from 'lodash';
import { Utility } from '../../../shared/classes/utility';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent extends AbstractDetail<UserQuery['user'],
    UserQueryVariables,
    CreateUserMutation['createUser'],
    CreateUserMutationVariables,
    UpdateUserMutation['updateUser'],
    UpdateUserMutationVariables,
    any> implements OnInit {

    public confirmPasswordStateMatcher = new ConfirmPasswordStateMatcher();
    private mandatoryBookables: AppDataSource;

    public step;
    public sending = false;

    constructor(userService: AnonymousUserService,
                alertService: AlertService,
                router: Router,
                route: ActivatedRoute,
                protected bookableService: BookableService,
                private apollo: Apollo,
    ) {
        super('user', userService, alertService, router, route);
    }

    ngOnInit() {

        this.step = +this.route.snapshot.data.step;

        super.ngOnInit();

        if (this.step === 1) {
            this.initStep1();
        } else if (this.step === 2) {
            this.initStep2();
        }

        this.bookableService.getMandatoryBookables().subscribe(bookables => {
            if (bookables) {
                this.mandatoryBookables = new AppDataSource(bookables);
            }
        });

    }

    public initStep1() {
    }

    private initStep2() {

        // Lock e-mail on step 2, this field must stay sync
        const email = this.form.get('email');
        if (email) {
            email.disable();
        }
    }

    public submit(): void {
        this.validateAllFormFields(this.form);
        if (this.form.invalid) {
            return;
        }

        if (this.step === 1) {
            this.register();
        } else if (this.step === 2) {
            this.confirmRegistration();
        }
    }

    private register(): void {
        this.sending = true;
        const mutation = gql`
            mutation Register($email: Email!, $hasInsurance: Boolean!, $termsAgreement: Boolean!) {
                register(email: $email, hasInsurance: $hasInsurance, termsAgreement: $termsAgreement)
            }
        `;

        this.apollo.mutate({
            mutation: mutation,
            variables: this.form.value,
        }).subscribe(() => {
            this.sending = false;

            const message = 'Un email avec des instructions a été envoyé';

            this.alertService.info(message, 5000);
            this.router.navigate(['/login']);
        }, () => this.sending = false);
    }

    private confirmRegistration(): void {
        this.sending = true;
        const mutation = gql`
            mutation ConfirmRegistration($token: Token!, $input: ConfirmRegistrationInput!) {
                confirmRegistration(token: $token, input: $input)
            }
        `;

        const fieldWhitelist = [
            'login',
            'password',
            'firstName',
            'lastName',
            'street',
            'postcode',
            'locality',
            'country',
        ];

        const input = pick(Utility.relationsToIds(this.form.value), fieldWhitelist);
        this.apollo.mutate({
            mutation: mutation,
            variables: {
                token: this.route.snapshot.params.token,
                input: input,
            },
        }).subscribe(() => {
            this.sending = false;

            const message = 'Vous pouvez maintenant vous connecter avec le login et mot de passe que vous avez choisi';

            this.alertService.info(message, 5000);
            this.router.navigate(['/login']);
        }, () => this.sending = false);
    }

}
