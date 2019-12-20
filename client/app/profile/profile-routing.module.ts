import { NgModule } from '@angular/core';
import { MatDialogConfig } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { NaturalDialogTriggerComponent, NaturalDialogTriggerRoutingData } from '@ecodev/natural';
import { OrderComponent } from '../admin/order/order/order.component';
import { OrdersComponent } from '../admin/order/orders/orders.component';
import { OrderResolver } from '../admin/order/services/order.resolver';
import { UserService } from '../admin/users/services/user.service';
import { ViewerResolver } from '../admin/users/services/viewer.resolver';
import { OrdersVariables } from '../shared/generated-types';
import { AuthGuard } from '../shared/guards/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
    {
        path: '',
        resolve: {viewer: ViewerResolver},
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                component: ProfileComponent,
                children: [
                    {
                        // todo : filter Orders for current user
                        path: 'commandes',
                        component: OrdersComponent,
                        resolve: {viewer: ViewerResolver},
                        data: {
                            contextColumns: ['creationDate', 'owner', 'balance'],
                        },
                        children: [
                            {
                                path: ':orderId',
                                component: NaturalDialogTriggerComponent,
                                resolve: {
                                    order: OrderResolver,
                                    viewer: ViewerResolver
                                },
                                data: {
                                    component: OrderComponent,
                                    dialogConfig: {
                                        data: {},
                                        width: '600px',
                                        maxWidth: '95vw',
                                        maxHeight: '97vh',
                                    } as MatDialogConfig,
                                } as NaturalDialogTriggerRoutingData,
                            },
                        ],
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
export class ProfileRoutingModule {
}
