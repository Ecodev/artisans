import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OrderModule } from '../admin/order/order.module';
import { ArtisansModule } from '../shared/modules/artisans.module';
import { MaterialModule } from '../shared/modules/material.module';
import { ProfileComponent } from './components/profile/profile.component';
import { ProvisionComponent } from './components/provision/provision.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { BvrComponent } from './components/bvr/bvr.component';

@NgModule({
    declarations: [
        ProfileComponent,
        ProvisionComponent,
        BvrComponent,
    ],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        MaterialModule,
        ArtisansModule,
        OrderModule,
    ],
    entryComponents: [
        ProvisionComponent,
    ],
    exports: [],
})
export class ProfileModule {
}
