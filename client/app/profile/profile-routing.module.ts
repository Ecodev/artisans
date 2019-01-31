import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { ViewerResolver } from '../admin/users/services/viewer.resolver';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterConfirmComponent } from './components/register/register-confirm.component';
import { UserByTokenResolver } from '../admin/users/services/userByToken.resolver';

const routes: Routes = [
    {
        path: '',
        component: ProfileComponent,
        resolve: {
            user: ViewerResolver,
        },
    },
    {
        path: 'new',
        component: RegisterComponent,
        data: {
            step: 1,
        },
    },
    {
        path: 'confirm/:token',
        component: RegisterConfirmComponent,
        data: {
            step: 2,
        },
        resolve: {
            user: UserByTokenResolver
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProfileRoutingModule {
}
