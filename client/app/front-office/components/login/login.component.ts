import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {NaturalAbstractController, NaturalAlertService} from '@ecodev/natural';
import {UserService} from '../../../admin/users/services/user.service';
import {finalize} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends NaturalAbstractController implements OnInit, OnDestroy {
    /**
     * Stores the received redirect URL until we need to use it (when login is successfull)
     */
    public returnUrl: string;
    public form: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        public alertService: NaturalAlertService,
        public snackBar: MatSnackBar,
        private readonly fb: FormBuilder,
    ) {
        super();
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email, Validators.maxLength(191)]],
            password: ['', [Validators.required]],
        });
    }

    public ngOnInit(): void {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        const logout = this.route.snapshot.queryParams['logout'] || false;

        // Attempt to skip login if user is already logged in (but not if is trying to logout)
        if (!logout) {
            if (this.route.snapshot.data.viewer.model) {
                this.redirect();
            }
        }
    }

    /**
     * Send mutation to log the user and redirect to home.
     */
    public login(): void {
        this.snackBar.dismiss();
        this.form.disable();

        this.userService
            .login(this.form.value)
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
