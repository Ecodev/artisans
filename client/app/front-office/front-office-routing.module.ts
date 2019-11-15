import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewerResolver } from '../admin/users/services/viewer.resolver';
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
