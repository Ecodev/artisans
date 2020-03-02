import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewerResolver } from '../../../admin/users/services/viewer.resolver';
import { AuthGuard } from '../../../shared/guards/auth.guard';
import { CartComponent } from './components/cart/cart.component';
import { CreateOrderComponent } from './components/create-order/create-order.component';

const routes: Routes = [
    {
        path: 'commande/:cartId',
        component: CreateOrderComponent,
        resolve: {viewer: ViewerResolver},
        canActivate: [AuthGuard],
    },
    {
        path: '',
        component: CartComponent,
    },
    {
        path: ':cartId',
        component: CartComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CartRoutingModule {
}
