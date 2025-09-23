import {Component, inject, OnInit} from '@angular/core';
import {
    IEnum,
    NaturalAbstractDetail,
    NaturalDetailHeaderComponent,
    NaturalEnumPipe,
    NaturalFixedButtonDetailComponent,
    NaturalRelationsComponent,
    NaturalSelectEnumComponent,
    NaturalSeoResolveData,
    NaturalStampComponent,
    NaturalTableButtonComponent,
    NaturalTimeAgoPipe,
} from '@ecodev/natural';
import {AsyncPipe, DatePipe} from '@angular/common';
import {UserRole} from '../../../shared/generated-types';
import {SessionService} from '../../sessions/services/session.service';
import {UserService} from '../services/user.service';
import {RouterOutlet} from '@angular/router';
import {OrdersComponent} from '../../order/orders/orders.component';
import {MatDivider} from '@angular/material/divider';
import {MatTooltip} from '@angular/material/tooltip';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatInput} from '@angular/material/input';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {AddressComponent} from '../../../shared/components/address/address.component';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {MatToolbar} from '@angular/material/toolbar';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
    selector: 'app-user',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NaturalDetailHeaderComponent,
        AsyncPipe,
        DatePipe,
        MatToolbar,
        MatTab,
        MatTabGroup,
        AddressComponent,
        MatFormField,
        MatLabel,
        MatError,
        MatInput,
        NaturalSelectEnumComponent,
        MatSlideToggle,
        MatTooltip,
        MatDivider,
        NaturalRelationsComponent,
        NaturalTableButtonComponent,
        NaturalStampComponent,
        OrdersComponent,
        NaturalFixedButtonDetailComponent,
        RouterOutlet,
        NaturalEnumPipe,
        NaturalTimeAgoPipe,
    ],
    templateUrl: './user.component.html',
    styleUrl: './user.component.scss',
})
export class UserComponent extends NaturalAbstractDetail<UserService, NaturalSeoResolveData> implements OnInit {
    public readonly sessionService = inject(SessionService);

    private userRolesAvailable: UserRole[] = [];

    public constructor() {
        super('user', inject(UserService));
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        // Disable fields that should be imported from Cresus
        ['phone', 'membership'].forEach(path => {
            const control = this.form.get(path);
            if (control) {
                control.disable();
            }
        });
    }

    protected override initForm(): void {
        super.initForm();

        this.service.getUserRolesAvailable(this.data.model).subscribe(userRoles => {
            this.userRolesAvailable = userRoles;
        });
    }

    public roleDisabled(): (item: IEnum) => boolean {
        return item => {
            return !this.userRolesAvailable.includes(item.value as UserRole);
        };
    }
}
