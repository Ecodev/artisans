import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EcoFabSpeedDialModule } from '@ecodev/fab-speed-dial';
import { AvatarModule } from 'ngx-avatar';
import { OrderModule } from '../order/order.module';
import { ProfileModule } from '../profile/profile.module';
import { ArtisansModule } from '../shared/modules/artisans.module';
import { MaterialModule } from '../shared/modules/material.module';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import { ProductComponent } from './products/product/product.component';
import { ProductTagComponent } from './productTags/productTag/productTag.component';
import { ProductTagsComponent } from './productTags/productTags/productTags.component';
import { UserComponent } from './users/user/user.component';
import { UserTagComponent } from './userTags/userTag/userTag.component';
import { UserTagsComponent } from './userTags/userTags/userTags.component';

@NgModule({
    declarations: [
        ProductComponent,
        AdminComponent,
        UserComponent,
        UserTagsComponent,
        UserTagComponent,
        ProductTagsComponent,
        ProductTagComponent,
    ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        MaterialModule,
        ArtisansModule,
        AvatarModule,
        ProfileModule,
        OrderModule,
        EcoFabSpeedDialModule,
    ],
    entryComponents: [],
})
export class AdminModule {
}
