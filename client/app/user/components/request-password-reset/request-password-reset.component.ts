import { Component } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ExtendedFormControl } from '../../../shared/classes/ExtendedFormControl';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { Relationship } from '../../../shared/generated-types';
import { Router } from '@angular/router';

@Component({
    selector: 'app-request-password-reset',
    templateUrl: './request-password-reset.component.html',
    styleUrls: ['./request-password-reset.component.scss'],
})
export class RequestPasswordResetComponent {

    public readonly form: FormGroup;
    public sending = false;

    constructor(private apollo: Apollo,
                private alertService: AlertService,
                private router: Router) {
        this.form = new FormGroup({login: new ExtendedFormControl('', [Validators.required])});
    }

    submit(): void {
        this.sending = true;
        const mutation = gql`
            mutation RequestPasswordReset($login: Login!) {
                requestPasswordReset(login: $login)
            }
        `;

        this.apollo.mutate({
            mutation: mutation,
            variables: {
                login: this.form.value.login,
            },
        }).subscribe(v => {
            this.sending = false;

            let message;
            if (v.data.requestPasswordReset === Relationship.householder) {
                message = 'Un email avec des instructions a été envoyé';
            } else {
                message = 'Un email avec des instructions a été envoyé au chef(e) de famille';
            }

            this.alertService.info(message, 5000);
            this.router.navigate(['/login']);
        }, () => this.sending = false);
    }
}
