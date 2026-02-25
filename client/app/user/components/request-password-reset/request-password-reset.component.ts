import {
    deliverableEmail,
    ifValid,
    NaturalAlertService,
    NaturalErrorMessagePipe,
    NaturalIconDirective,
    validateAllFormControls,
} from '@ecodev/natural';
import {Component, inject} from '@angular/core';
import {FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../../../admin/users/services/user.service';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {MatError, MatFormField, MatLabel, MatPrefix} from '@angular/material/form-field';

@Component({
    selector: 'app-request-password-reset',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormField,
        MatLabel,
        MatError,
        NaturalErrorMessagePipe,
        MatPrefix,
        MatInput,
        MatIcon,
        NaturalIconDirective,
        MatButton,
    ],
    templateUrl: './request-password-reset.component.html',
    styleUrl: './request-password-reset.component.scss',
})
export class RequestPasswordResetComponent {
    private readonly alertService = inject(NaturalAlertService);
    private readonly router = inject(Router);
    private readonly userService = inject(UserService);
    private readonly fb = inject(NonNullableFormBuilder);

    protected readonly form = this.fb.group({
        email: ['', [Validators.required, deliverableEmail, Validators.maxLength(191)]],
    });
    protected sending = false;

    protected submit(): void {
        validateAllFormControls(this.form);
        ifValid(this.form).subscribe(() => {
            this.sending = true;

            this.userService.requestPasswordReset(this.form.getRawValue().email).subscribe({
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
