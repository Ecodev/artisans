import {Routes} from '@angular/router';
import {NaturalDialogTriggerComponent, NaturalDialogTriggerRoutingData, NaturalSeo} from '@ecodev/natural';
import {canActivateAdministration} from '../shared/guards/administration.guard';
import {AdminComponent} from './admin/admin.component';
import {CommentComponent} from './comments/comment/comment.component';
import {CommentsComponent} from './comments/comments/comments.component';
import {resolveComment} from './comments/services/comment.resolver';
import {EventComponent} from './events/event/event.component';
import {EventsComponent} from './events/events/events.component';
import {resolveEvent} from './events/services/event.resolver';
import {FacilitatorDocumentComponent} from './facilitator-documents/facilitator-document/facilitator-document.component';
import {FacilitatorDocumentsComponent} from './facilitator-documents/facilitator-documents/facilitator-documents.component';
import {resolveFacilitatorDocument} from './facilitator-documents/services/facilitator-document.resolver';
import {NewsComponent} from './newses/news/news.component';
import {NewsesComponent} from './newses/newses/newses.component';
import {resolveNews} from './newses/services/news.resolver';
import {OrderLineComponent} from './order/order-line/order-line.component';
import {OrderComponent} from './order/order/order.component';
import {OrdersComponent} from './order/orders/orders.component';
import {orderLineResolvers} from './order/services/order-line.resolver';
import {resolveOrder} from './order/services/order.resolver';
import {ProductComponent} from './products/product/product.component';
import {ProductsComponent} from './products/products/products.component';
import {resolveProduct} from './products/services/product.resolver';
import {resolveSession} from './sessions/services/session.resolver';
import {SessionComponent} from './sessions/session/session.component';
import {SessionsComponent} from './sessions/sessions/sessions.component';
import {resolveUser} from './users/services/user.resolver';
import {resolveViewer} from './users/services/viewer.resolver';
import {UserComponent} from './users/user/user.component';
import {UsersComponent} from './users/users/users.component';
import {ImportComponent} from './users/import/import.component';

const orderDetails = [
    {
        path: ':orderId',
        component: NaturalDialogTriggerComponent,
        resolve: {
            model: resolveOrder,
            viewer: resolveViewer,
        },
        data: {
            trigger: {
                component: OrderComponent,
                dialogConfig: {
                    minWidth: '600px',
                    maxWidth: '95vw',
                    maxHeight: '97vh',
                },
            } satisfies NaturalDialogTriggerRoutingData<OrderComponent, never>,
            seo: {
                title: 'Commande',
            } satisfies NaturalSeo,
        },
    },
    {
        path: 'order-line/:orderLineId',
        component: NaturalDialogTriggerComponent,
        resolve: {
            ...orderLineResolvers,
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
            } satisfies NaturalDialogTriggerRoutingData<OrderLineComponent, never>,
            seo: {
                title: "Modification de la vente d'un produit",
            } satisfies NaturalSeo,
        },
    },
];

export const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        canActivate: [canActivateAdministration],
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
                    } satisfies NaturalSeo,
                },
            },
            {
                path: 'product',
                children: [
                    {
                        path: 'new',
                        component: ProductComponent,
                        resolve: {
                            model: resolveProduct,
                        },
                        data: {
                            seo: {
                                title: 'Nouveau produit',
                            } satisfies NaturalSeo,
                        },
                    },
                    {
                        path: ':productId', // last
                        component: ProductComponent,
                        resolve: {
                            model: resolveProduct,
                        },
                        data: {
                            seo: {
                                resolve: true,
                            } satisfies NaturalSeo,
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
                    } satisfies NaturalSeo,
                },
            },
            {
                path: 'user',
                children: [
                    {
                        path: ':userId', // last
                        component: UserComponent,
                        resolve: {
                            model: resolveUser,
                        },
                        data: {
                            seo: {
                                resolve: true,
                            } satisfies NaturalSeo,
                        },
                        children: orderDetails,
                    },
                ],
            },
            {
                path: 'import',
                component: ImportComponent,
                data: {
                    seo: {
                        title: 'Import',
                    } satisfies NaturalSeo,
                },
            },
            {
                path: 'order', // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                component: OrdersComponent,
                data: {
                    seo: {
                        title: 'Ventes',
                    } satisfies NaturalSeo,
                },
                children: orderDetails,
            },
            {
                path: 'news', // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                component: NewsesComponent,
                data: {
                    seo: {
                        title: 'Actualités et articles',
                    } satisfies NaturalSeo,
                },
            },
            {
                path: 'news',
                children: [
                    {
                        path: 'new',
                        component: NewsComponent,
                        resolve: {
                            model: resolveNews,
                        },
                        data: {
                            seo: {
                                title: 'Nouvelle actualité',
                            } satisfies NaturalSeo,
                        },
                    },
                    {
                        path: ':newsId', // last
                        component: NewsComponent,
                        resolve: {
                            model: resolveNews,
                        },
                        data: {
                            seo: {
                                resolve: true,
                            } satisfies NaturalSeo,
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
                    } satisfies NaturalSeo,
                },
            },
            {
                path: 'event',
                children: [
                    {
                        path: 'new',
                        component: EventComponent,
                        resolve: {model: resolveEvent},
                        data: {
                            seo: {
                                title: 'Nouvel événement',
                            } satisfies NaturalSeo,
                        },
                    },
                    {
                        path: ':eventId', // last
                        component: EventComponent,
                        resolve: {model: resolveEvent},
                        data: {
                            seo: {
                                resolve: true,
                            } satisfies NaturalSeo,
                        },
                    },
                ],
            },
            {
                path: 'session', // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                component: SessionsComponent,
                data: {
                    selectedColumns: ['name', 'endDate', 'facilitators'],
                    seo: {
                        title: 'Conversations carbone',
                    } satisfies NaturalSeo,
                },
            },
            {
                path: 'session',
                children: [
                    {
                        path: 'new',
                        component: SessionComponent,
                        resolve: {model: resolveSession},
                        data: {
                            seo: {
                                title: 'Nouvelle session carbone',
                            } satisfies NaturalSeo,
                        },
                    },
                    {
                        path: ':sessionId', // last
                        component: SessionComponent,
                        resolve: {model: resolveSession},
                        data: {
                            seo: {
                                resolve: true,
                            } satisfies NaturalSeo,
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
                    } satisfies NaturalSeo,
                },
            },
            {
                path: 'comment',
                children: [
                    {
                        path: 'new',
                        component: CommentComponent,
                        resolve: {model: resolveComment},
                        data: {
                            seo: {
                                title: 'Nouveau commentaire',
                            } satisfies NaturalSeo,
                        },
                    },
                    {
                        path: ':commentId', // last
                        component: CommentComponent,
                        resolve: {model: resolveComment},
                        data: {
                            seo: {
                                resolve: true,
                            } satisfies NaturalSeo,
                        },
                    },
                ],
            },
            {
                path: 'facilitator-document', // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                component: FacilitatorDocumentsComponent,
                data: {
                    seo: {
                        title: 'Documents facilitateurs',
                    } satisfies NaturalSeo,
                },
            },
            {
                path: 'facilitator-document',
                children: [
                    {
                        path: 'new',
                        component: FacilitatorDocumentComponent,
                        resolve: {
                            model: resolveFacilitatorDocument,
                        },
                        data: {
                            seo: {
                                title: 'Nouveau document',
                            } satisfies NaturalSeo,
                        },
                    },
                    {
                        path: ':facilitatorDocumentId', // last
                        component: FacilitatorDocumentComponent,
                        resolve: {
                            model: resolveFacilitatorDocument,
                        },
                        data: {
                            seo: {
                                resolve: true,
                            } satisfies NaturalSeo,
                        },
                    },
                ],
            },
        ],
    },
];
