import {Routes} from '@angular/router';
import {NaturalDialogTriggerComponent, NaturalDialogTriggerRoutingData, NaturalSeo} from '@ecodev/natural';
import {OrderComponent} from '../admin/order/order/order.component';
import {resolveOrder} from '../admin/order/services/order.resolver';
import {resolveViewer, resolveViewerForProfile} from '../admin/users/services/viewer.resolver';
import {canActivateAuth} from '../shared/guards/auth.guard';
import {AccountComponent} from './components/account/account.component';
import {HistoryComponent} from './components/history/history.component';
import {ProfileComponent} from './components/profile/profile.component';
import {PurchasesComponent} from './components/purchases/purchases.component';

export const routes: Routes = [
    {
        path: '',
        component: ProfileComponent,
        resolve: {viewer: resolveViewer},
        canActivate: [canActivateAuth],
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'articles-achetes',
            },
            {
                path: 'commandes',
                component: HistoryComponent,
                resolve: {viewer: resolveViewer},
                data: {seo: {title: 'Mes commandes'} satisfies NaturalSeo},
                children: [
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
                                    width: '600px',
                                    maxWidth: '95vw',
                                    maxHeight: '97vh',
                                },
                            } satisfies NaturalDialogTriggerRoutingData<OrderComponent, never>,
                        },
                    },
                ],
            },
            {
                path: 'donnees-personnelles',
                component: AccountComponent,
                resolve: {model: resolveViewerForProfile},
                data: {seo: {title: 'Données personnelles'} satisfies NaturalSeo},
            },
            {
                path: 'articles-achetes',
                component: PurchasesComponent,
                data: {seo: {title: 'Articles achetés'} satisfies NaturalSeo},
            },
        ],
    },
];
