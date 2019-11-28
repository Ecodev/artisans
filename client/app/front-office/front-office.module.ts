import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EcoFabSpeedDialModule } from '@ecodev/fab-speed-dial';
import { AvatarModule } from 'ngx-avatar';
import { LoginComponent } from '../login/login.component';
import { OrderModule } from '../order/order.module';
import { ProfileModule } from '../profile/profile.module';
import { ArtisansModule } from '../shared/modules/artisans.module';
import { MaterialModule } from '../shared/modules/material.module';

import { FrontOfficeRoutingModule } from './front-office-routing.module';
import { FrontOfficeComponent } from './front-office.component';
import { HomepageComponent } from './homepage/homepage.component';
import { HomeBlockComponent } from './home-block/home-block.component';

@NgModule({
    declarations: [
        HomepageComponent,
        FrontOfficeComponent,
        LoginComponent,
        HomeBlockComponent
    ],
    imports: [
        CommonModule,
        FrontOfficeRoutingModule,
        MaterialModule,
        ArtisansModule,
        AvatarModule,
        ProfileModule,
        OrderModule,
        EcoFabSpeedDialModule,
    ],
    entryComponents: [],
})
export class FrontOfficeModule {
}
