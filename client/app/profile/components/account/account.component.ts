import {Component, Injector, OnInit} from '@angular/core';
import {NaturalAbstractDetail} from '@ecodev/natural';
import {UserService} from '../../../admin/users/services/user.service';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
})
export class AccountComponent extends NaturalAbstractDetail<UserService> implements OnInit {
    public UserService = UserService;

    /**
     * True while password request is pending
     */
    public passwordMailSending = false;

    public constructor(private readonly userService: UserService, injector: Injector) {
        super('user', userService, injector);
    }

    public ngOnInit(): void {
        super.ngOnInit();

        // Always disable email
        const email = this.form.get('email');
        if (email) {
            email.disable();
        }
    }

    public requestPasswordReset(): void {
        this.userService.requestPasswordReset(this.form.get('email')?.value).subscribe({
            next: () => {
                this.passwordMailSending = false;
                this.alertService.info('Un email avec des instructions a été envoyé', 6000);
            },
            error: () => (this.passwordMailSending = false),
        });
    }
}
