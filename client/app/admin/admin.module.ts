import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { BookablesComponent } from './bookables/bookables/bookables.component';
import { AdminComponent } from './admin/admin.component';
import { AvatarModule } from 'ngx-avatar';
import { BookableComponent } from './bookables/bookable/bookable.component';
import { MaterialModule } from '../shared/modules/material.module';
import { IchtusModule } from '../shared/modules/ichtus.module';
import { StampComponent } from './shared/components/stamp/stamp.component';
import { EnumPipe } from '../shared/pipes/enum.pipe';
import { CapitalizePipe } from '../shared/pipes/capitalize.pipe';
import { LicensesComponent } from './licenses/licenses/licenses.component';
import { LicenseComponent } from './licenses/license/license.component';
import { UserTagsComponent } from './userTags/userTags/userTags.component';
import { UserTagComponent } from './userTags/userTag/userTag.component';
import { UserComponent } from './users/user/user.component';
import { UsersComponent } from './users/users/users.component';
import { BookingsComponent } from './bookings/bookings/bookings.component';
import { BookingComponent } from './bookings/booking/booking.component';

@NgModule({
    declarations: [
        BookablesComponent,
        BookableComponent,
        AdminComponent,
        BookingsComponent,
        UsersComponent,
        UserComponent,
        StampComponent,
        EnumPipe,
        CapitalizePipe,
        LicensesComponent,
        LicenseComponent,
        UserTagsComponent,
        UserTagComponent,
        BookingComponent
    ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        MaterialModule,
        IchtusModule,
        AvatarModule,
    ],
})
export class AdminModule {
}
