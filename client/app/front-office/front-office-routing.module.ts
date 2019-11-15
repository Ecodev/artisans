import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewerResolver } from '../admin/users/services/viewer.resolver';
import { LoginComponent } from '../login/login.component';
import { FrontOfficeComponent } from './front-office.component';
import { HomepageComponent } from './homepage/homepage.component';

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
                    path: 'profile',
                    loadChildren: () => import('../profile/profile.module').then(m => m.ProfileModule),
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
