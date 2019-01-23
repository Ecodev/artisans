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

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
})
export class SignupComponent extends AbstractDetail<UserQuery['user'],
    UserQueryVariables,
    CreateUserMutation['createUser'],
    CreateUserMutationVariables,
    UpdateUserMutation['updateUser'],
    UpdateUserMutationVariables,
    any> implements OnInit {

    public confirmPasswordStateMatcher = new ConfirmPasswordStateMatcher();
    private mandatoryBookables: AppDataSource;

    public step;

    constructor(userService: AnonymousUserService,
                alertService: AlertService,
                router: Router,
                route: ActivatedRoute,
                protected bookableService: BookableService,
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
    }

    public submitStep2() {
        this.validateAllFormFields(this.form); // t
    }

}
