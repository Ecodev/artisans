import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OrderModule } from '../admin/order/order.module';
import { ArtisansModule } from '../shared/modules/artisans.module';
import { MaterialModule } from '../shared/modules/material.module';
import { BvrComponent } from './components/bvr/bvr.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProvisionComponent } from './components/provision/provision.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { HistoryComponent } from './components/history/history.component';
import { PurchasesComponent } from './components/purchases/purchases.component';

@NgModule({
    declarations: [
        ProfileComponent,
        ProvisionComponent,
        BvrComponent,
        HistoryComponent,
        PurchasesComponent,
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
