import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ResourcesComponent } from './resources/resources/resources.component';
import { AdminComponent } from './admin/admin.component';
import { BookingsComponent } from './bookings/bookings/bookings.component';
import { UsersComponent } from './user/users/users.component';
import { AvatarModule } from 'ngx-avatar';
import { ResourceComponent } from './resources/resource/resource.component';
import { EcoFabSpeedDialModule } from '@ecodev/fab-speed-dial';
import { MaterialModule } from '../shared/modules/material.module';
import { IchtusModule } from '../shared/modules/ichtus.module';

@NgModule({
    declarations: [
        ResourcesComponent,
        ResourceComponent,
        AdminComponent,
        BookingsComponent,
        UsersComponent,
    ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        MaterialModule,
        IchtusModule,
        AvatarModule,
        EcoFabSpeedDialModule,
    ],
})
export class AdminModule {
}
