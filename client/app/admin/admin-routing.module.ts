import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NaturalDialogTriggerComponent, NaturalDialogTriggerRoutingData, NaturalSeo} from '@ecodev/natural';
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
                    seo: {
                        title: 'Produits',
                    } as NaturalSeo,
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
                        data: {
                            seo: {
                                title: 'Nouveau produit',
                            } as NaturalSeo,
                        },
                    },
                    {
                        path: ':productId', // last
                        component: ProductComponent,
                        resolve: {
                            product: ProductResolver,
                        },
                        data: {
                            seo: {
                                resolveKey: 'product',
                            } as NaturalSeo,
                        },
                    },
                ],
            },
            {
                path: 'user', // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                component: UsersComponent,
                data: {
                    seo: {
                        title: 'Tous les utilisateurs',
                    } as NaturalSeo,
                },
            },
            {
                path: 'user',
                children: [
                    {
                        path: ':userId', // last
                        component: UserComponent,
                        resolve: {
                            user: UserResolver,
                        },
                        data: {
                            seo: {
                                resolveKey: 'user',
                            } as NaturalSeo,
                        },
                    },
                ],
            },
            {
                path: 'import',
                component: ImportComponent,
                data: {
                    seo: {
                        title: 'Import',
                    } as NaturalSeo,
                },
            },
            {
                path: 'order', // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                component: OrdersComponent,
                data: {
                    seo: {
                        title: 'Ventes',
                    } as NaturalSeo,
                },
                children: [
                    {
                        path: ':orderId',
                        component: NaturalDialogTriggerComponent,
                        resolve: {
                            order: OrderResolver,
                            viewer: ViewerResolver,
                        },
                        data: {
                            trigger: {
                                component: OrderComponent,
                                dialogConfig: {
                                    width: '600px',
                                    maxWidth: '95vw',
                                    maxHeight: '97vh',
                                },
                            } as NaturalDialogTriggerRoutingData,
                            seo: {
                                title: 'Commande',
                            } as NaturalSeo,
                        },
                    },
                    {
                        path: 'order-line/:orderLineId',
                        component: NaturalDialogTriggerComponent,
                        resolve: {
                            orderLine: OrderLineResolver,
                        },
                        data: {
                            trigger: {
                                component: OrderLineComponent,
                                dialogConfig: {
                                    width: '600px',
                                    maxWidth: '95vw',
                                    maxHeight: '97vh',
                                    autoFocus: false,
                                },
                            } as NaturalDialogTriggerRoutingData,
                            seo: {
                                title: "Modification de la vente d'un produit",
                            } as NaturalSeo,
                        },
                    },
                ],
            },
            {
                path: 'news', // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                component: NewsesComponent,
                data: {
                    seo: {
                        title: 'Actualités et articles',
                    } as NaturalSeo,
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
                        data: {
                            seo: {
                                title: 'Nouvelle actualité',
                            } as NaturalSeo,
                        },
                    },
                    {
                        path: ':newsId', // last
                        component: NewsComponent,
                        resolve: {
                            news: NewsResolver,
                        },
                        data: {
                            seo: {
                                resolveKey: 'news',
                            } as NaturalSeo,
                        },
                    },
                ],
            },
            {
                path: 'event', // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                component: EventsComponent,
                data: {
                    seo: {
                        title: 'Événements',
                    } as NaturalSeo,
                },
            },
            {
                path: 'event',
                children: [
                    {
                        path: 'new',
                        component: EventComponent,
                        resolve: {event: EventResolver},
                        data: {
                            seo: {
                                title: 'Nouvel événement',
                            } as NaturalSeo,
                        },
                    },
                    {
                        path: ':eventId', // last
                        component: EventComponent,
                        resolve: {event: EventResolver},
                        data: {
                            seo: {
                                resolveKey: 'event',
                            } as NaturalSeo,
                        },
                    },
                ],
            },
            {
                path: 'session', // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                component: SessionsComponent,
                data: {
                    initialColumns: ['name', 'endDate', 'facilitators'],
                    seo: {
                        title: 'Conversations carbone',
                    } as NaturalSeo,
                },
            },
            {
                path: 'session',
                children: [
                    {
                        path: 'new',
                        component: SessionComponent,
                        resolve: {session: SessionResolver},
                        data: {
                            seo: {
                                title: 'Nouvelle session carbone',
                            } as NaturalSeo,
                        },
                    },
                    {
                        path: ':sessionId', // last
                        component: SessionComponent,
                        resolve: {session: SessionResolver},
                        data: {
                            seo: {
                                resolveKey: 'session',
                            } as NaturalSeo,
                        },
                    },
                ],
            },
            {
                path: 'comment', // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                component: CommentsComponent,
                data: {
                    seo: {
                        title: 'Commentaires',
                    } as NaturalSeo,
                },
            },
            {
                path: 'comment',
                children: [
                    {
                        path: 'new',
                        component: CommentComponent,
                        resolve: {comment: CommentResolver},
                        data: {
                            seo: {
                                title: 'Nouveau commentaire',
                            } as NaturalSeo,
                        },
                    },
                    {
                        path: ':commentId', // last
                        component: CommentComponent,
                        resolve: {comment: CommentResolver},
                        data: {
                            seo: {
                                resolveKey: 'comment',
                            } as NaturalSeo,
                        },
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
