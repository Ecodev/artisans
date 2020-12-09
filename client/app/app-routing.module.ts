import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ViewerResolver} from './admin/users/services/viewer.resolver';
import {FrontOfficeComponent} from './front-office/front-office.component';
import {ErrorComponent} from './shared/components/error/error.component';

export const routes: Routes = [
    {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    },
    {
        // Registration
        path: 'user',
        component: FrontOfficeComponent,
        loadChildren: () => import('./user/user.module').then(m => m.UserModule),
    },
    {
        path: '',
        component: FrontOfficeComponent,
        resolve: {viewer: ViewerResolver},
        loadChildren: () => import('./front-office/front-office.module').then(m => m.FrontOfficeModule),
    },
    {
        path: 'error',
        component: FrontOfficeComponent,
        children: [
            {
                path: '',
                component: ErrorComponent,
            },
        ],
    },
    {
        // 404 redirects to home
        path: '**',
        redirectTo: '',
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            paramsInheritanceStrategy: 'always',
            scrollPositionRestoration: 'top',
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
