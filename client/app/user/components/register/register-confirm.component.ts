import {Apollo} from 'apollo-angular';
import {Component, OnInit} from '@angular/core';
import {deliverableEmail, NaturalAlertService, relationsToIds} from '@ecodev/natural';
import {pick} from 'lodash-es';
import {RegisterComponent} from './register.component';
import {UntypedFormBuilder, Validators} from '@angular/forms';
import {UserByTokenResolve} from '../../../admin/users/user';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmRegistrationVariables, UserByToken_userByToken} from '../../../shared/generated-types';
import {UserService} from '../../../admin/users/services/user.service';

@Component({
    selector: 'app-confirm',
    templateUrl: './register.component.html', // Use same template as parent class
    styleUrls: ['./register.component.scss'],
})
export class RegisterConfirmComponent extends RegisterComponent implements OnInit {
    public constructor(
        apollo: Apollo,
        route: ActivatedRoute,
        fb: UntypedFormBuilder,
        router: Router,
        alertService: NaturalAlertService,
        private readonly userService: UserService,
    ) {
        super(apollo, route, fb, router, alertService);
        this.step = 2;
    }

    public override ngOnInit(): void {
        this.route.data.subscribe(data => {
            this.initFormFromModel((data['user'] as UserByTokenResolve)['model']);
        });
    }

    private initFormFromModel(model: UserByToken_userByToken): void {
        this.form = this.fb.group({
            // Lock e-mail, this field must not be changed
            email: [{value: model.email, disabled: true}, [Validators.required, deliverableEmail]],
            password: [''],
            firstName: [model.firstName, [Validators.required, Validators.maxLength(100)]],
            lastName: [model.lastName, [Validators.required, Validators.maxLength(100)]],
            street: [model.street, [Validators.required]],
            postcode: [model.postcode, [Validators.required]],
            locality: [model.locality, [Validators.required]],
            country: [model.country, [Validators.required]],
        });
    }

    /**
     * Confirm user registration
     */
    protected override doSubmit(): void {
        this.sending = true;

        const fieldWhitelist = [
            'login',
            'password',
            'firstName',
            'lastName',
            'street',
            'postcode',
            'locality',
            'birthday',
            'country',
        ];

        const input = pick(relationsToIds(this.form.value), fieldWhitelist) as ConfirmRegistrationVariables['input'];
        this.userService
            .confirmRegistration({
                token: this.route.snapshot.params.token,
                input: input,
            })
            .subscribe({
                next: () => this.alertService.info("Merci d'avoir confirmé votre compte", 5000),
                error: () => (this.sending = false),
            });
    }
}
