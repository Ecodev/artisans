import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { BookablesComponent } from './bookables/bookables/bookables.component';
import { AdminComponent } from './admin/admin.component';
import { BookingsComponent } from './bookings/bookings/bookings.component';
import { UsersComponent } from './user/users/users.component';
import { AvatarModule } from 'ngx-avatar';
import { BookableComponent } from './bookables/bookable/bookable.component';
import { MaterialModule } from '../shared/modules/material.module';
import { IchtusModule } from '../shared/modules/ichtus.module';
import { UserComponent } from './user/user/user.component';
import { StampComponent } from './shared/components/stamp/stamp.component';
import { EnumPipe } from '../shared/pipes/enum.pipe';
import { CapitalizePipe } from '../shared/pipes/capitalize.pipe';

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
