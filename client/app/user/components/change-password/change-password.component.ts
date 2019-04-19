import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NaturalAlertService } from '../../../natural/modules/alert/alert.service';
import { FormGroup } from '@angular/forms';
import gql from 'graphql-tag';
import { NetworkActivityService } from '../../../shared/services/network-activity.service';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent {

    private readonly token: string;
    public readonly form: FormGroup;
    public sending = false;

    constructor(route: ActivatedRoute,
                private apollo: Apollo,
                private alertService: NaturalAlertService,
                private network: NetworkActivityService,
                private router: Router) {
        this.token = route.snapshot.params.token;

        this.form = new FormGroup({});

        // Watch errors
        this.network.errors.subscribe(errors => {
            if (errors.length) {
                this.sending = false;
                this.alertService.error(errors[0].message, 5000);
            }
        });
    }

    submit(): void {

        this.sending = true;
        const mutation = gql`
            mutation UpdatePassword($token: Token!, $password: Password!) {
                updatePassword(token: $token, password: $password)
            }
        `;

        this.apollo.mutate({
            mutation: mutation,
            variables: {
                token: this.token,
                password: this.form.value.password,
            },
        }).subscribe(v => {
            this.sending = false;
            if (v.data.updatePassword) {
                this.alertService.info('Le mot de passe a été mis à jour', 5000);
                this.router.navigate(['/login']);
            } else {
                const message = 'Le token utilisé est invalide. Il est probablement expiré. Faites une nouvelle demande de modification.';
                this.alertService.error(message, 5000);
                this.router.navigate(['/user/request-password-reset']);
            }
        }, () => this.sending = false);
    }
}
