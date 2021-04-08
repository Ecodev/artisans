import {Apollo} from 'apollo-angular';
import {Component} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {ifValid, NaturalAlertService, validateAllFormControls} from '@ecodev/natural';
import {UserService} from '../../../admin/users/services/user.service';

@Component({
    selector: 'app-request-password-reset',
    templateUrl: './request-password-reset.component.html',
    styleUrls: ['./request-password-reset.component.scss'],
})
export class RequestPasswordResetComponent {
    public readonly form: FormGroup;
    public sending = false;

    constructor(
        private readonly apollo: Apollo,
        private readonly alertService: NaturalAlertService,
        private readonly router: Router,
        private readonly userService: UserService,
    ) {
        this.form = new FormGroup({email: new FormControl('', userService.getFormValidators().email)});
    }

    public submit(): void {
        validateAllFormControls(this.form);
        ifValid(this.form).subscribe(() => {
            this.sending = true;

            this.userService.requestPasswordReset(this.form.value.email).subscribe(
                () => {
                    this.sending = false;

                    const message = 'Un email avec des instructions a été envoyé';

                    this.alertService.info(message, 5000);
                    this.router.navigate(['/login']);
                },
                () => (this.sending = false),
            );
        });
    }
}
