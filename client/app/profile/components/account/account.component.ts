import {Component, inject, OnInit} from '@angular/core';
import {NaturalAbstractDetail, NaturalIconDirective} from '@ecodev/natural';
import {UserService} from '../../../admin/users/services/user.service';
import {MatIcon} from '@angular/material/icon';
import {AddressComponent} from '../../../shared/components/address/address.component';
import {MatDivider} from '@angular/material/divider';
import {MatButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
    selector: 'app-account',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormField,
        MatLabel,
        MatInput,
        MatButton,
        MatDivider,
        AddressComponent,
        MatIcon,
        NaturalIconDirective,
    ],
    templateUrl: './account.component.html',
    styleUrl: './account.component.scss',
})
export class AccountComponent extends NaturalAbstractDetail<UserService> implements OnInit {
    /**
     * True while password request is pending
     */
    protected passwordMailSending = false;

    public constructor() {
        super('user', inject(UserService));
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        // Always disable email
        const email = this.form.get('email');
        if (email) {
            email.disable();
        }
    }

    protected requestPasswordReset(): void {
        this.service.requestPasswordReset(this.form.get('email')?.value).subscribe({
            next: () => {
                this.passwordMailSending = false;
                this.alertService.info('Un email avec des instructions a été envoyé', 6000);
            },
            error: () => (this.passwordMailSending = false),
        });
    }
}
