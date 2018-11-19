import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './shared/services/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserResolver } from './user/services/user.resolver';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
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
                path: 'admin',
                loadChildren: './admin/admin.module#AdminModule'
            }
        ],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
