import {Component, Injector, OnInit} from '@angular/core';
import {NaturalAbstractDetail, validateAllFormControls} from '@ecodev/natural';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import {
    CreateUser,
    CreateUserVariables,
    UpdateUser,
    UpdateUserVariables,
    User,
    UserVariables,
} from '../../../shared/generated-types';
import {AnonymousUserService} from './anonymous-user.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent
    extends NaturalAbstractDetail<
        User['user'],
        UserVariables,
        CreateUser['createUser'],
        CreateUserVariables,
        UpdateUser['updateUser'],
        UpdateUserVariables,
        any
    >
    implements OnInit {
    public step;
    public sending = false;

    constructor(userService: AnonymousUserService, injector: Injector, protected apollo: Apollo) {
        super('user', userService, injector);
    }

    public ngOnInit(): void {
        this.step = +this.route.snapshot.data.step;

        super.ngOnInit();

        const email = this.form.get('email');
        if (email && this.step === 1) {
            email.setValue(this.route.snapshot.params.email);
        }
    }

    public submit(): void {
        validateAllFormControls(this.form);

        if (this.form.invalid) {
            return;
        }

        this.doSubmit();
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
            .mutate({
                mutation: mutation,
                variables: this.form.value,
            })
            .subscribe(
                () => {
                    this.sending = false;

                    const message = 'Un email avec des instructions a été envoyé';

                    this.alertService.info(message, 5000);
                    this.router.navigate(['/login']);
                },
                () => (this.sending = false),
            );
    }
}
