import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './shared/services/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ErrorComponent } from './shared/components/error/error.component';
import { UserResolver } from './admin/users/services/user.resolver';
import { RequestPasswordResetComponent } from './request-password-reset/request-password-reset.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'request-password-reset',
        component: RequestPasswordResetComponent,
    },
    {
        path: 'change-password',
        component: ChangePasswordComponent,
    },
    {
        path: 'signup',
        loadChildren: './profile/profile.module#ProfileModule',
    },
    // Auth required routes
    {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard],
        resolve: {user: UserResolver},
        children: [
            {
                path: '',
                component: DashboardComponent,
            },
            {
                path: 'booking',
                loadChildren: './booking/booking.module#BookingModule',
            },
            {
                path: 'admin',
                loadChildren: './admin/admin.module#AdminModule',
            },
            {
                path: 'profile',
                loadChildren: './profile/profile.module#ProfileModule',
            },
            {
                path: 'error',
                component: ErrorComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
