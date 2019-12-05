import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EcoFabSpeedDialModule } from '@ecodev/fab-speed-dial';
import { OrderModule } from '../order/order.module';
import { ProfileModule } from '../profile/profile.module';
import { ArtisansModule } from '../shared/modules/artisans.module';
import { MaterialModule } from '../shared/modules/material.module';
import { HomeBlockComponent } from './components/home-block/home-block.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginComponent } from './components/login/login.component';

import { FrontOfficeRoutingModule } from './front-office-routing.module';
import { FrontOfficeComponent } from './front-office.component';
import { ShopModule } from './modules/shop/shop.module';

@NgModule({
    declarations: [
        HomepageComponent,
        FrontOfficeComponent,
        LoginComponent,
        HomeBlockComponent,
    ],
    imports: [
        CommonModule,
        FrontOfficeRoutingModule,
        MaterialModule,
        ArtisansModule,
        ProfileModule,
        OrderModule,
        EcoFabSpeedDialModule,
        ShopModule,
    ],
    entryComponents: [],
})
export class FrontOfficeModule {
}
