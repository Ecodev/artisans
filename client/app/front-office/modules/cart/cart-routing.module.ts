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

        // todo : ideally remove guard, and provide form in CreateOrderComponent as stated in
        // https://projects.invisionapp.com/share/X6RSC2TZGNF#/screens/369040799
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
