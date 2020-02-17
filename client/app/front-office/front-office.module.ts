import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EcoFabSpeedDialModule } from '@ecodev/fab-speed-dial';
import { OrderModule } from '../admin/order/order.module';
import { ProfileModule } from '../profile/profile.module';
import { ArtisansModule } from '../shared/modules/artisans.module';
import { MaterialModule } from '../shared/modules/material.module';
import { HomeBlockComponent } from './components/home-block/home-block.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { NextSessionsComponent } from './components/next-sessions/next-sessions.component';
import { SessionPageComponent } from './components/session-page/session-page.component';

import { FrontOfficeRoutingModule } from './front-office-routing.module';
import { FrontOfficeComponent } from './front-office.component';
import { ShopModule } from './modules/shop/shop.module';
import { NewsesPageComponent } from './components/newses-page/newses-page.component';
import { EventsPageComponent } from './components/events-page/events-page.component';

@NgModule({
    declarations: [
        HomepageComponent,
        FrontOfficeComponent,
        LoginComponent,
        HomeBlockComponent,
        NextSessionsComponent,
        SessionPageComponent,
        MenuComponent,
        NewsesPageComponent,
        EventsPageComponent,
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
    entryComponents: [MenuComponent],
})
export class FrontOfficeModule {
}
