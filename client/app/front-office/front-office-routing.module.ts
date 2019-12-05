import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewerResolver } from '../admin/users/services/viewer.resolver';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginComponent } from './components/login/login.component';
import { FrontOfficeComponent } from './front-office.component';

const routes: Routes = [
        {
            path: '',
            component: FrontOfficeComponent,
            resolve: {viewer: ViewerResolver},
            children: [
                {
                    path: '',
                    component: HomepageComponent,
                },
                {
                    path: 'login',
                    component: LoginComponent,
                    resolve: {viewer: ViewerResolver},
                },
                {
                    path: 'mon-compte',
                    loadChildren: () => import('../profile/profile.module').then(m => m.ProfileModule),
                },
                {
                    path: 'larevuedurable',
                    loadChildren: () => import('./modules/shop/shop.module').then(m => m.ShopModule),
                },
                {
                    path: 'panier',
                    loadChildren: () => import('./modules/cart/cart.module').then(m => m.CartModule),
                },
            ],
        },
    ]
;

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FrontOfficeRoutingModule {
}
