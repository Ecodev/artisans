import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserByTokenResolver } from '../admin/users/services/userByToken.resolver';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { RegisterConfirmComponent } from './components/register/register-confirm.component';
import { RegisterComponent } from './components/register/register.component';
import { RequestPasswordResetComponent } from './components/request-password-reset/request-password-reset.component';

const routes: Routes = [
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
            user: UserByTokenResolver,
        },
    },
    {
        path: 'request-password-reset',
        component: RequestPasswordResetComponent,
    },
    {
        path: 'change-password/:token',
        component: ChangePasswordComponent,
        resolve: {
            user: UserByTokenResolver,
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UserRoutingModule {
}
