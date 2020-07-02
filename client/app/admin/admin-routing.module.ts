import {NgModule} from '@angular/core';
import {MatDialogConfig} from '@angular/material/dialog';
import {RouterModule, Routes} from '@angular/router';
import {NaturalDialogTriggerComponent} from '@ecodev/natural';
import {AdministrationGuard} from '../shared/guards/administration.guard';
import {AdminComponent} from './admin/admin.component';
import {CommentComponent} from './comments/comment/comment.component';
import {CommentsComponent} from './comments/comments/comments.component';
import {CommentResolver} from './comments/services/comment.resolver';
import {EventComponent} from './events/event/event.component';
import {EventsComponent} from './events/events/events.component';
import {EventResolver} from './events/services/event.resolver';
import {NewsComponent} from './newses/news/news.component';
import {NewsesComponent} from './newses/newses/newses.component';
import {NewsResolver} from './newses/services/news.resolver';
import {OrderLineComponent} from './order/order-line/order-line.component';
import {OrderComponent} from './order/order/order.component';
import {OrdersComponent} from './order/orders/orders.component';
import {OrderLineResolver} from './order/services/order-line.resolver';
import {OrderResolver} from './order/services/order.resolver';
import {ProductComponent} from './products/product/product.component';
import {ProductsComponent} from './products/products/products.component';
import {ProductResolver} from './products/services/product.resolver';
import {SessionResolver} from './sessions/services/session.resolver';
import {SessionComponent} from './sessions/session/session.component';
import {SessionsComponent} from './sessions/sessions/sessions.component';
import {UserResolver} from './users/services/user.resolver';
import {ViewerResolver} from './users/services/viewer.resolver';
import {UserComponent} from './users/user/user.component';
import {UsersComponent} from './users/users/users.component';
import {ImportComponent} from './users/import/import.component';

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
                path: 'import',
                component: ImportComponent,
                data: {
                    title: 'Import',
                },
            },
            {
                path: 'order', // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                component: OrdersComponent,
                data: {title: 'Ventes'},
                children: [
                    {
                        path: ':orderId',
                        component: NaturalDialogTriggerComponent,
                        resolve: {
                            order: OrderResolver,
                            viewer: ViewerResolver,
                        },
                        data: {
                            component: OrderComponent,
                            dialogConfig: {
                                data: {},
                                width: '600px',
                                maxWidth: '95vw',
                                maxHeight: '97vh',
                            } as MatDialogConfig,
                        },
                    },
                    {
                        path: 'order-line/:orderLineId',
                        component: NaturalDialogTriggerComponent,
                        resolve: {
                            orderLine: OrderLineResolver,
                        },
                        data: {
                            component: OrderLineComponent,
                            dialogConfig: {
                                data: {},
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
                    title: 'Conversations carbone',
                    contextColumns: ['name', 'endDate', 'facilitators'],
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
            {
                path: 'comment', // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                component: CommentsComponent,
                data: {title: 'Commentaires'},
            },
            {
                path: 'comment',
                children: [
                    {
                        path: 'new',
                        component: CommentComponent,
                        resolve: {comment: CommentResolver},
                    },
                    {
                        path: ':commentId', // last
                        component: CommentComponent,
                        resolve: {comment: CommentResolver},
                    },
                ],
            },
        ],
    },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {}
