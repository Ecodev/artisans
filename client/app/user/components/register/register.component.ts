import {Apollo, gql} from 'apollo-angular';
import {Component, OnInit} from '@angular/core';
import {
    deliverableEmail,
    ifValid,
    NaturalAlertService,
    validateAllFormControls,
    NaturalIconDirective,
} from '@ecodev/natural';
import {ActivatedRoute, Router} from '@angular/router';
import {UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Register, RegisterVariables} from '../../../shared/generated-types';
import {MatButtonModule} from '@angular/material/button';
import {AddressComponent} from '../../../shared/components/address/address.component';
import {PasswordComponent} from '../password/password.component';
import {MatDividerModule} from '@angular/material/divider';
import {NgIf} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        FlexModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        NaturalIconDirective,
        NgIf,
        MatDividerModule,
        PasswordComponent,
        AddressComponent,
        MatButtonModule,
    ],
})
export class RegisterComponent implements OnInit {
    public step = 1;
    public sending = false;
    public form!: UntypedFormGroup;

    public constructor(
        protected readonly apollo: Apollo,
        protected readonly route: ActivatedRoute,
        protected readonly fb: UntypedFormBuilder,
        protected readonly router: Router,
        protected readonly alertService: NaturalAlertService,
    ) {}

    public ngOnInit(): void {
        this.initForm();
    }

    private initForm(): void {
        this.form = this.fb.group({
            email: [this.route.snapshot.params.email, [Validators.required, deliverableEmail]],
        });
    }

    public submit(): void {
        validateAllFormControls(this.form);

        ifValid(this.form).subscribe(() => this.doSubmit());
    }

    /**
     * Register new user
     */
    protected doSubmit(): void {
        this.sending = true;
        const mutation = gql`
            mutation Register($email: Email!) {
                register(email: $email)
            }
        `;

        this.apollo
            .mutate<Register, RegisterVariables>({
                mutation: mutation,
                variables: this.form.value,
            })
            .subscribe({
                next: () => {
                    this.sending = false;

                    const message = 'Un email avec des instructions a été envoyé';

                    this.alertService.info(message, 5000);
                    this.router.navigate(['/login']);
                },
                error: () => (this.sending = false),
            });
    }
}
