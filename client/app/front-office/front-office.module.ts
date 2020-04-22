import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EcoFabSpeedDialModule } from '@ecodev/fab-speed-dial';
import { OrderModule } from '../admin/order/order.module';
import { ProfileModule } from '../profile/profile.module';
import { ArtisansModule } from '../shared/modules/artisans.module';
import { MaterialModule } from '../shared/modules/material.module';
import { ssrCompatibleStorageProvider } from '../shared/utils';
import { CommentListComponent } from './components/comment-list/comment-list.component';
import { DonationComponent } from './components/donation/donation.component';
import { EventPageComponent } from './components/event-page/event-page.component';
import { EventsPageComponent } from './components/events-page/events-page.component';
import { HomeBlockComponent } from './components/home-block/home-block.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { NewsPageComponent } from './components/news-page/news-page.component';
import { NewsesPageComponent } from './components/newses-page/newses-page.component';
import { NextSessionsComponent } from './components/next-sessions/next-sessions.component';
import { SessionPageComponent } from './components/session-page/session-page.component';

import { FrontOfficeRoutingModule } from './front-office-routing.module';
import { FrontOfficeComponent } from './front-office.component';
import { ShopModule } from './modules/shop/shop.module';

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
        DonationComponent,
        EventPageComponent,
        NewsPageComponent,
        CommentListComponent,
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
    providers: [
        ssrCompatibleStorageProvider,
    ],
})
export class FrontOfficeModule {
}
