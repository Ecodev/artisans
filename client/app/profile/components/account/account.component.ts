import {Component, OnInit} from '@angular/core';
import {NaturalAbstractDetail, NaturalIconDirective} from '@ecodev/natural';
import {UserService} from '../../../admin/users/services/user.service';
import {MatIconModule} from '@angular/material/icon';
import {AddressComponent} from '../../../shared/components/address/address.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrl: './account.component.scss',
    standalone: true,
    imports: [
        FlexModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDividerModule,
        AddressComponent,
        MatIconModule,
        NaturalIconDirective,
    ],
})
export class AccountComponent extends NaturalAbstractDetail<UserService> implements OnInit {
    public UserService = UserService;

    /**
     * True while password request is pending
     */
    public passwordMailSending = false;

    public constructor(private readonly userService: UserService) {
        super('user', userService);
    }

    public override ngOnInit(): void {
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
