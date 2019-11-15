import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewerResolver } from './admin/users/services/viewer.resolver';
import { FrontOfficeComponent } from './front-office/front-office.component';
import { HomepageComponent } from './front-office/homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './shared/components/error/error.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        resolve: {viewer: ViewerResolver},
    },
    {
        // Registration
        path: 'user',
        component: FrontOfficeComponent,
        loadChildren: () => import('./user/user.module').then(m => m.UserModule),
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    },
    // Auth required routes
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
                path: 'profile',
                loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
            },
        ],
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
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            paramsInheritanceStrategy: 'always',
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
