import {Apollo, gql} from 'apollo-angular';
import {Component, OnInit} from '@angular/core';
import {deliverableEmail, NaturalAlertService, relationsToIds} from '@ecodev/natural';
import {pick} from 'lodash-es';
import {RegisterComponent} from './register.component';
import {FormBuilder, Validators} from '@angular/forms';
import {UserByTokenResolve} from '../../../admin/users/user';
import {ActivatedRoute, Router} from '@angular/router';
import {
    ConfirmRegistration,
    ConfirmRegistrationVariables,
    UserByToken_userByToken,
} from '../../../shared/generated-types';

@Component({
    selector: 'app-confirm',
    templateUrl: './register.component.html', // Use same template as parent class
    styleUrls: ['./register.component.scss'],
})
export class RegisterConfirmComponent extends RegisterComponent implements OnInit {
    constructor(
        apollo: Apollo,
        route: ActivatedRoute,
        fb: FormBuilder,
        router: Router,
        alertService: NaturalAlertService,
    ) {
        super(apollo, route, fb, router, alertService);
        this.step = 2;
    }

    public ngOnInit(): void {
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
    protected doSubmit(): void {
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
            'birthday',
            'country',
        ];

        const input = pick(relationsToIds(this.form.value), fieldWhitelist) as ConfirmRegistrationVariables['input'];
        this.apollo
            .mutate<ConfirmRegistration, ConfirmRegistrationVariables>({
                mutation: mutation,
                variables: {
                    token: this.route.snapshot.params.token,
                    input: input,
                },
            })
            .subscribe({
                next: () => {
                    this.sending = false;

                    const message =
                        'Vous pouvez maintenant vous connecter avec le login et mot de passe que vous avez choisi';

                    this.alertService.info(message, 5000);
                    this.router.navigate(['/mon-compte']);
                },
                error: () => (this.sending = false),
            });
    }
}
