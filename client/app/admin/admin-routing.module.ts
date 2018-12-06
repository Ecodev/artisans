import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { BookablesComponent } from './bookables/bookables/bookables.component';
import { BookingsComponent } from './bookings/bookings/bookings.component';
import { UsersComponent } from './user/users/users.component';
import { BookableComponent } from './bookables/bookable/bookable.component';
import { BookableResolver } from './bookables/bookables/bookable.resolver';
import { UserComponent } from './user/user/user.component';
import { UserResolver } from './user/services/user.resolver';

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
                path: 'bookable',
                component: BookablesComponent,
            },
            {
                path: 'bookable/:bookableId',
                component: BookableComponent,
                resolve: {
                    bookable: BookableResolver,
                },
            },
            {
                path: 'user',
                component: UsersComponent,
            },
            {
                path: 'user/:userId',
                component: UserComponent,
                resolve: {
                    user: UserResolver,
                },
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
