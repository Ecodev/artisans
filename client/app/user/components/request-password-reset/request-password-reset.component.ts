import {Component} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {ifValid, NaturalAlertService, NaturalIconDirective, validateAllFormControls} from '@ecodev/natural';
import {UserService} from '../../../admin/users/services/user.service';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
    selector: 'app-request-password-reset',
    templateUrl: './request-password-reset.component.html',
    styleUrl: './request-password-reset.component.scss',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        NaturalIconDirective,
        MatButtonModule,
    ],
})
export class RequestPasswordResetComponent {
    public readonly form: FormGroup;
    public sending = false;

    public constructor(
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

            this.userService.requestPasswordReset(this.form.value.email).subscribe({
                next: () => {
                    this.sending = false;

                    const message = 'Un email avec des instructions a été envoyé';

                    this.alertService.info(message, 5000);
                    this.router.navigate(['/login']);
                },
                error: () => (this.sending = false),
            });
        });
    }
}
