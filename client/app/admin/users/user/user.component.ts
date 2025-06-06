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
import {CommonModule, DatePipe} from '@angular/common';
import {UserRole} from '../../../shared/generated-types';
import {SessionService} from '../../sessions/services/session.service';
import {UserService} from '../services/user.service';
import {RouterOutlet} from '@angular/router';
import {OrdersComponent} from '../../order/orders/orders.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {AddressComponent} from '../../../shared/components/address/address.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrl: './user.component.scss',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NaturalDetailHeaderComponent,
        CommonModule,
        MatToolbarModule,
        MatTabsModule,
        AddressComponent,
        MatFormFieldModule,
        MatInputModule,
        NaturalSelectEnumComponent,
        MatSlideToggleModule,
        MatTooltipModule,
        MatDividerModule,
        NaturalRelationsComponent,
        NaturalTableButtonComponent,
        NaturalStampComponent,
        OrdersComponent,
        NaturalFixedButtonDetailComponent,
        RouterOutlet,
        NaturalEnumPipe,
        DatePipe,
        NaturalTimeAgoPipe,
    ],
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
