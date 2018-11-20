import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ResourcesComponent } from './resources/resources/resources.component';
import { AdminComponent } from './admin/admin.component';
import { AppMaterialModule } from '../app-material/app-material.module';
import { BookingsComponent } from './bookings/bookings/bookings.component';
import { IconModule } from '../shared/components/icon/icon.module';
import { UsersComponent } from './user/users/users.component';
import { NaturalSearchModule } from '@ecodev/natural-search';
import { ColumnsPickerComponent } from '../shared/components/columns-picker/columns-picker.component';
import { TableButtonComponent } from './shared/components/table-button/table-button.component';
import { FixedButtonComponent } from '../shared/components/fixed-button/fixed-button.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColumnsPickerColumnDirective } from '../shared/components/columns-picker/columns-picker-column.directive';
import { AvatarModule } from 'ngx-avatar';

@NgModule({
    declarations: [
        ResourcesComponent,
        AdminComponent,
        BookingsComponent,
        UsersComponent,
        ColumnsPickerComponent,
        ColumnsPickerColumnDirective,
        TableButtonComponent,
        FixedButtonComponent
    ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        AppMaterialModule,
        IconModule,
        NaturalSearchModule,
        FormsModule,
        ReactiveFormsModule,
        AvatarModule
    ],
})
export class AdminModule {
}
