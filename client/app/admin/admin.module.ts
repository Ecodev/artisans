import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EcoFabSpeedDialModule } from '@ecodev/fab-speed-dial';
import { AvatarModule } from 'ngx-avatar';
import { ProfileModule } from '../profile/profile.module';
import { ArtisansModule } from '../shared/modules/artisans.module';
import { MaterialModule } from '../shared/modules/material.module';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import { EventComponent } from './events/event/event.component';
import { EventsComponent } from './events/events/events.component';
import { NewsComponent } from './newses/news/news.component';
import { NewsesComponent } from './newses/newses/newses.component';
import { OrderModule } from './order/order.module';
import { ProductComponent } from './products/product/product.component';
import { SessionComponent } from './sessions/session/session.component';
import { SessionsComponent } from './sessions/sessions/sessions.component';
import { UserTagComponent } from './user-tags/user-tag/user-tag.component';
import { UserTagsComponent } from './user-tags/user-tags/user-tags.component';
import { UserComponent } from './users/user/user.component';

@NgModule({
    declarations: [
        ProductComponent,
        AdminComponent,
        UserComponent,
        UserTagsComponent,
        UserTagComponent,
        NewsesComponent,
        NewsComponent,
        EventsComponent,
        EventComponent,
        SessionsComponent,
        SessionComponent,
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
