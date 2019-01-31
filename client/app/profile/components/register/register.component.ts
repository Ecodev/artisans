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

    public submit() {
        if (this.step === 1) {
            this.submitStep1();
        } else if (this.step === 2) {
            this.submitStep2();
        }
    }

    public submitStep1() {
        this.validateAllFormFields(this.form);
        if (this.form.invalid) {
            return;
        }

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

    public submitStep2() {
        this.validateAllFormFields(this.form);

    }

}
