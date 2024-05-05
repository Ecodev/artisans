import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {deliverableEmail, ifValid, NaturalAbstractController, NaturalAlertService} from '@ecodev/natural';
import {UserService} from '../../../admin/users/services/user.service';
import {finalize} from 'rxjs/operators';
import {FormsModule, ReactiveFormsModule, NonNullableFormBuilder, Validators} from '@angular/forms';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        RouterLink,
        MatDividerModule,
    ],
})
export class LoginComponent extends NaturalAbstractController implements OnInit, OnDestroy {
    /**
     * Stores the received redirect URL until we need to use it (when login is successfull)
     */
    public returnUrl = '/';
    public readonly form = this.fb.group({
        email: ['', [Validators.required, deliverableEmail, Validators.maxLength(191)]],
        password: ['', [Validators.required]],
    });

    public constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly userService: UserService,
        public readonly alertService: NaturalAlertService,
        public readonly snackBar: MatSnackBar,
        private readonly fb: NonNullableFormBuilder,
    ) {
        super();
    }

    public ngOnInit(): void {
        this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
        const logout = this.route.snapshot.queryParams.logout || false;

        // Attempt to skip login if user is already logged in (but not if is trying to logout)
        if (!logout) {
            if (this.route.snapshot.data.viewer) {
                this.redirect();
            }
        }
    }

    public maybeConfirm(): void {
        ifValid(this.form).subscribe(() => this.login());
    }

    /**
     * Send mutation to log the user and redirect to home.
     */
    private login(): void {
        this.snackBar.dismiss();
        this.form.disable();

        this.userService
            .login(this.form.getRawValue())
            .pipe(finalize(() => this.form.enable()))
            .subscribe(() => {
                this.redirect();
            });
    }

    /**
     * Redirect to home or redirect URL from GET params
     */
    private redirect(): void {
        this.router.navigateByUrl(this.returnUrl || '/');
    }
}
