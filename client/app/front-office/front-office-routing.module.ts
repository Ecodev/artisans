import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionResolver } from '../admin/sessions/services/session.resolver';
import { ViewerResolver } from '../admin/users/services/viewer.resolver';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginComponent } from './components/login/login.component';
import { NextSessionsComponent } from './components/next-sessions/next-sessions.component';
import { SessionPageComponent } from './components/session-page/session-page.component';

const routes: Routes = [
        {
            path: '',
            component: HomepageComponent,
        },
        {
            path: 'prochaines-conversations-carbone',
            component: NextSessionsComponent,
        },
        {
            path: 'prochaines-conversations-carbone/:region',
            component: NextSessionsComponent,
        },
        {
            path: 'conversation-carbone/:sessionId',
            component: SessionPageComponent,
            resolve: {session: SessionResolver},
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
    ]
;

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FrontOfficeRoutingModule {
}
