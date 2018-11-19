import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ResourcesComponent } from './resources/resources/resources.component';
import { AdminComponent } from './admin/admin.component';
import { AppMaterialModule } from '../app-material/app-material.module';
import { BookingsComponent } from './bookings/bookings.component';
import { IconModule } from '../shared/components/icon/icon.module';

@NgModule({
    declarations: [ResourcesComponent, AdminComponent, BookingsComponent],
    imports: [
        CommonModule,
        AdminRoutingModule,
        AppMaterialModule,
        IconModule
    ],
})
export class AdminModule {
}
