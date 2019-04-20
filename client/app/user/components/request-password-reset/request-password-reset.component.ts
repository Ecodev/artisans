import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { Relationship } from '../../../shared/generated-types';
import { Router } from '@angular/router';
import { UserService } from '../../../admin/users/services/user.service';
import { NaturalAlertService } from '@ecodev/natural';
import { NaturalFormControl } from '@ecodev/natural';

@Component({
    selector: 'app-request-password-reset',
    templateUrl: './request-password-reset.component.html',
    styleUrls: ['./request-password-reset.component.scss'],
})
export class RequestPasswordResetComponent {

    public readonly form: FormGroup;
    public sending = false;

    constructor(private apollo: Apollo,
                private alertService: NaturalAlertService,
                private router: Router,
                private userService: UserService) {
        this.form = new FormGroup({login: new NaturalFormControl('', userService.getFormValidators().login)});
    }

    submit(): void {
        this.sending = true;

        this.userService.requestPasswordReset(this.form.value.login).subscribe(v => {
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
