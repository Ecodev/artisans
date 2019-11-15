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
import { ProductComponent } from './products/product/product.component';
import { ProductsComponent } from './products/products/products.component';
import { ProductResolver } from './products/services/product.resolver';
import { UserResolver } from './users/services/user.resolver';
import { UserComponent } from './users/user/user.component';
import { UsersComponent } from './users/users/users.component';
import { UserTagResolver } from './userTags/services/userTag.resolver';
import { UserTagComponent } from './userTags/userTag/userTag.component';
import { UserTagsComponent } from './userTags/userTags/userTags.component';

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
                        isAdmin: true,
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
                        isAdmin: true,
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
                            data: {
                                isAdmin: true,
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
