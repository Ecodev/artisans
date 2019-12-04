import { NgModule } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { RouterModule, Routes } from '@angular/router';
import { OrderLineComponent } from '../order/order-line/order-line.component';
import { OrderComponent } from '../order/order/order.component';
import { OrdersComponent } from '../order/orders/orders.component';
import { OrderLineResolver } from '../order/services/order-line.resolver';
import { OrderResolver } from '../order/services/order.resolver';
import { DialogTriggerComponent } from '../shared/components/modal-trigger/dialog-trigger.component';
import { AdministrationGuard } from '../shared/guards/administration.guard';
import { AdminComponent } from './admin/admin.component';
import { EventComponent } from './events/event/event.component';
import { EventsComponent } from './events/events/events.component';
import { EventResolver } from './events/services/event.resolver';
import { NewsComponent } from './newses/news/news.component';
import { NewsesComponent } from './newses/newses/newses.component';
import { NewsResolver } from './newses/services/news.resolver';
import { ProductComponent } from './products/product/product.component';
import { ProductsComponent } from './products/products/products.component';
import { ProductResolver } from './products/services/product.resolver';
import { SessionResolver } from './sessions/services/session.resolver';
import { SessionComponent } from './sessions/session/session.component';
import { SessionsComponent } from './sessions/sessions/sessions.component';
import { UserTagResolver } from './user-tags/services/user-tag.resolver';
import { UserTagComponent } from './user-tags/user-tag/user-tag.component';
import { UserTagsComponent } from './user-tags/user-tags/user-tags.component';
import { UserResolver } from './users/services/user.resolver';
import { UserComponent } from './users/user/user.component';
import { UsersComponent } from './users/users/users.component';

const routes: Routes = [
        {
            path: '',
            component: AdminComponent,
            canActivate: [AdministrationGuard],
            children: [
                {
                    path: '',
                    pathMatch: 'full',
                    redirectTo: '/admin/product',
                },
                {
                    path: 'product', // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                    component: ProductsComponent,
                    data: {
                        title: 'Produits',
                    },
                },
                {
                    path: 'product',
                    children: [
                        {
                            path: 'new',
                            component: ProductComponent,
                            resolve: {
                                product: ProductResolver,
                            },
                        },
                        {
                            path: ':productId', // last
                            component: ProductComponent,
                            resolve: {
                                product: ProductResolver,
                            },
                        },
                    ],
                },
                {
                    path: 'user', // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                    component: UsersComponent,
                    data: {
                        title: 'Tous les utilisateurs',
                    },
                },
                {
                    path: 'user',
                    children: [
                        {
                            path: 'new',
                            component: UserComponent,
                            resolve: {
                                user: UserResolver,
                            },
                        },
                        {
                            path: ':userId', // last
                            component: UserComponent,
                            resolve: {
                                user: UserResolver,
                            },
                        },
                    ],
                },
                {
                    path: 'user-tag', // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                    component: UserTagsComponent,
                    data: {
                        title: 'Tags d\'utilisateurs',
                    },
                },
                {
                    path: 'user-tag',
                    children: [
                        {
                            path: 'new',
                            component: UserTagComponent,
                            resolve: {
                                userTag: UserTagResolver,
                            },
                        },
                        {
                            path: ':userTagId', // last
                            component: UserTagComponent,
                            resolve: {
                                userTag: UserTagResolver,
                            },
                        },
                    ],
                },
                {
                    path: 'order', // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                    component: OrdersComponent,
                    data: {title: 'Ventes'},
                    children: [
                        {
                            path: ':orderId',
                            component: DialogTriggerComponent,
                            resolve: {
                                order: OrderResolver,
                            },
                            data: {
                                component: OrderComponent,
                                dialogConfig: {
                                    width: '600px',
                                    maxWidth: '95vw',
                                    maxHeight: '97vh',
                                } as MatDialogConfig,
                            },
                        },
                        {
                            path: 'order-line/:orderLineId',
                            component: DialogTriggerComponent,
                            resolve: {
                                orderLine: OrderLineResolver,
                            },
                            data: {
                                component: OrderLineComponent,
                                dialogConfig: {
                                    width: '600px',
                                    maxWidth: '95vw',
                                    maxHeight: '97vh',
                                    autoFocus: false,
                                } as MatDialogConfig,
                            },
                        },
                    ],
                },
                {
                    path: 'news', // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                    component: NewsesComponent,
                    data: {
                        title: 'Actualités et articles',
                    },
                },
                {
                    path: 'news',
                    children: [
                        {
                            path: 'new',
                            component: NewsComponent,
                            resolve: {
                                news: NewsResolver,
                            },
                        },
                        {
                            path: ':newsId', // last
                            component: NewsComponent,
                            resolve: {
                                news: NewsResolver,
                            },
                        },
                    ],
                },
                {
                    path: 'event', // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                    component: EventsComponent,
                    data: {
                        title: 'Événements',
                    },
                },
                {
                    path: 'event',
                    children: [
                        {
                            path: 'new',
                            component: EventComponent,
                            resolve: {event: EventResolver},
                        },
                        {
                            path: ':eventId', // last
                            component: EventComponent,
                            resolve: {event: EventResolver},
                        },
                    ],
                },
                {
                    path: 'session', // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                    component: SessionsComponent,
                    data: {
                        title: 'Événements',
                    },
                },
                {
                    path: 'session',
                    children: [
                        {
                            path: 'new',
                            component: SessionComponent,
                            resolve: {session: SessionResolver},
                        },
                        {
                            path: ':sessionId', // last
                            component: SessionComponent,
                            resolve: {session: SessionResolver},
                        },
                    ],
                },
            ],
        },
    ]
;

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {
}
