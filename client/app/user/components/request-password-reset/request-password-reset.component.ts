import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NaturalAlertService, NaturalFormControl } from '@ecodev/natural';
import { Apollo } from 'apollo-angular';
import { UserService } from '../../../admin/users/services/user.service';

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
        this.form = new FormGroup({email: new NaturalFormControl('', userService.getFormValidators().email)});
    }

    submit(): void {
        this.sending = true;

        this.userService.requestPasswordReset(this.form.value.email).subscribe(v => {
            this.sending = false;

            const message = 'Un email avec des instructions a été envoyé';

            this.alertService.info(message, 5000);
            this.router.navigate(['/login']);
        }, () => this.sending = false);
    }
}
