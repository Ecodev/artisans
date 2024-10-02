import {Apollo, gql} from 'apollo-angular';
import {Component, inject, OnInit} from '@angular/core';
import {
    deliverableEmail,
    ifValid,
    NaturalAlertService,
    NaturalIconDirective,
    validateAllFormControls,
} from '@ecodev/natural';
import {ActivatedRoute, Router} from '@angular/router';
import {FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Register, RegisterVariables} from '../../../shared/generated-types';
import {MatButtonModule} from '@angular/material/button';
import {AddressComponent} from '../../../shared/components/address/address.component';
import {PasswordComponent} from '../password/password.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        NaturalIconDirective,
        MatDividerModule,
        PasswordComponent,
        AddressComponent,
        MatButtonModule,
    ],
})
export class RegisterComponent implements OnInit {
    protected readonly apollo = inject(Apollo);
    protected readonly route = inject(ActivatedRoute);
    protected readonly fb = inject(NonNullableFormBuilder);
    protected readonly router = inject(Router);
    protected readonly alertService = inject(NaturalAlertService);

    public step = 1;
    public sending = false;
    public form!: FormGroup;

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
