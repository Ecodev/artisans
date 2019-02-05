import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DoorComponent } from './door/door.component';
import { AuthGuard } from './shared/services/auth.guard';
import { DoorGuard } from './shared/services/door.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ErrorComponent } from './shared/components/error/error.component';
import { UserResolver } from './admin/users/services/user.resolver';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'user',
        component: HomeComponent,
        loadChildren: './user/user.module#UserModule',
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
                path: 'door',
                component: DoorComponent,
                canActivate: [DoorGuard],
            },
        ],
    },
    {
        path: 'error',
        component: HomeComponent,
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
