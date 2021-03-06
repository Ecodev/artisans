import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NaturalDialogTriggerComponent, NaturalDialogTriggerRoutingData} from '@ecodev/natural';
import {OrderComponent} from '../admin/order/order/order.component';
import {OrderResolver} from '../admin/order/services/order.resolver';
import {ViewerResolver} from '../admin/users/services/viewer.resolver';
import {AuthGuard} from '../shared/guards/auth.guard';
import {AccountComponent} from './components/account/account.component';
import {HistoryComponent} from './components/history/history.component';
import {ProfileComponent} from './components/profile/profile.component';
import {PurchasesComponent} from './components/purchases/purchases.component';
import {NaturalSeo} from '@ecodev/natural';

const routes: Routes = [
    {
        path: '',
        component: ProfileComponent,
        resolve: {viewer: ViewerResolver},
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'articles-achetes',
            },
            {
                path: 'commandes',
                component: HistoryComponent,
                resolve: {viewer: ViewerResolver},
                data: {seo: {title: 'Mes commandes'} as NaturalSeo},
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
                        },
                    },
                ],
            },
            {
                path: 'donnees-personnelles',
                component: AccountComponent,
                resolve: {user: ViewerResolver},
                data: {seo: {title: 'Données personnelles'} as NaturalSeo},
            },
            {
                path: 'articles-achetes',
                component: PurchasesComponent,
                data: {seo: {title: 'Articles achetés'} as NaturalSeo},
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProfileRoutingModule {}
