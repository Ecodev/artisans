import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { ResourcesComponent } from './resources/resources/resources.component';
import { BookingsComponent } from './bookings/bookings/bookings.component';
import { UsersComponent } from './user/users/users.component';
import { ResourceComponent } from './resources/resource/resource.component';
import { ResourceResolver } from './resources/resources/resource.resolver';

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: '',
                component: BookingsComponent,
            },
            {
                path: 'resource',
                component: ResourcesComponent,
            },
            {
                path: 'resource/:resourceId',
                component: ResourceComponent,
                resolve: {
                    resource: ResourceResolver,
                },
            },
            {
                path: 'user',
                component: UsersComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {
}
