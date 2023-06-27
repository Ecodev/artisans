import {Routes} from '@angular/router';
import {resolveViewer} from '../../../admin/users/services/viewer.resolver';
import {canActivateAuth} from '../../../shared/guards/auth.guard';
import {CartComponent} from './components/cart/cart.component';
import {CreateOrderComponent} from './components/create-order/create-order.component';
import {NaturalSeo} from '@ecodev/natural';

export const routes: Routes = [
    {
        path: 'commande/:cartId',
        component: CreateOrderComponent,
        resolve: {viewer: resolveViewer},
        canActivate: [canActivateAuth],
        data: {seo: {title: 'Panier'} satisfies NaturalSeo},
    },
    {
        path: '',
        component: CartComponent,
        data: {seo: {title: 'Panier'} satisfies NaturalSeo},
    },
    {
        path: ':cartId',
        component: CartComponent,
        data: {seo: {title: 'Panier'} satisfies NaturalSeo},
    },
];
