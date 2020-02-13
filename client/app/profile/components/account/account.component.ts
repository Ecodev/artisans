import { Component, Injector, OnInit } from '@angular/core';
import { NaturalAbstractDetail } from '@ecodev/natural';
import { UserService } from '../../../admin/users/services/user.service';
import { CreateUser, CreateUserVariables, UpdateUser, UpdateUserVariables, User, UserVariables } from '../../../shared/generated-types';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
})
export class AccountComponent
    extends NaturalAbstractDetail<User['user'],
        UserVariables,
        CreateUser['createUser'],
        CreateUserVariables,
        UpdateUser['updateUser'],
        UpdateUserVariables,
        any> implements OnInit {

    public UserService = UserService;

    /**
     * True while password request is pending
     */
    public passwordMailSending = false;

    constructor(private userService: UserService,
                injector: Injector,
    ) {
        super('user', userService, injector);
    }

    public requestPasswordReset() {
        this.userService.requestPasswordReset(this.form.value.email).subscribe(v => {
            this.passwordMailSending = false;
            this.alertService.info('Un email avec des instructions a été envoyé', 6000);
        }, () => this.passwordMailSending = false);
    }

}