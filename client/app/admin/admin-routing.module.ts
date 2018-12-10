import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { BookablesComponent } from './bookables/bookables/bookables.component';
import { BookingsComponent } from './bookings/bookings/bookings.component';
import { UsersComponent } from './user/users/users.component';
import { BookableComponent } from './bookables/bookable/bookable.component';
import { UserComponent } from './user/user/user.component';
import { UserResolver } from './user/services/user.resolver';
import { BookableFilter, BookingType } from '../shared/generated-types';
import { LicenseResolver } from './licenses/services/license.resolver';
import { BookableResolver } from './bookables/services/bookable.resolver';
import { LicensesComponent } from './licenses/licenses/licenses.component';
import { LicenseComponent } from './licenses/license/license.component';
import { UserTagsComponent } from './userTags/userTags/userTags.component';
import { UserTagComponent } from './userTags/userTag/userTag.component';
import { UserTagResolver } from './userTags/services/userTag.resolver';

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: '',
                component: BookingsComponent,
                data : {
                    title: 'Sorties en cours'
                }
            },
            {
                path: 'bookable',
                children: [
                    {
                        path: 'self-approved',
                        component: BookablesComponent,
                        data: {
                            title: 'Matériel carnet de sortie',
                            routeFilter: {
                                filter: {groups: [{conditions: [{bookingType: {equal: {value: BookingType.self_approved}}}]}]},
                            } as BookableFilter,
                        },
                    },
                    {
                        path: 'admin-approved',
                        component: BookablesComponent,
                        data: {
                            title: 'Matériel sur demande',
                            routeFilter: {
                                filter: {groups: [{conditions: [{bookingType: {equal: {value: BookingType.admin_approved}}}]}]},
                            } as BookableFilter,
                        },
                    },
                    {
                        path: 'admin-only',
                        component: BookablesComponent,
                        data: {
                            title: 'Inventaire et services',
                            routeFilter: {
                                filter: {groups: [{conditions: [{bookingType: {equal: {value: BookingType.admin_only}}}]}]},
                            } as BookableFilter,
                        },
                    },
                    {
                        path: 'mandatory',
                        component: BookablesComponent,
                        data: {
                            title: 'Services obligatoire',
                            routeFilter: {
                                filter: {groups: [{conditions: [{bookingType: {equal: {value: BookingType.mandatory}}}]}]},
                            } as BookableFilter,
                        },
                    },
                    {
                        path: 'new',
                        component: BookableComponent,
                        resolve: {
                            bookable: BookableResolver,
                        },
                    },
                    {
                        // Doit venir après les autres routes, sinon l':bookableId intercepte tout.
                        path: ':bookableId',
                        component: BookableComponent,
                        resolve: {
                            bookable: BookableResolver,
                        },
                    },
                ],
            },
            {
                path: 'license',
                component: LicensesComponent,
                data: {
                    title: 'Certifications'
                }
            },
            {
                path: 'license/new',
                component: LicenseComponent,
                resolve: {
                    license: LicenseResolver,
                },
            },
            {
                path: 'license/:licenseId', // last
                component: LicenseComponent,
                resolve: {
                    license: LicenseResolver,
                },
            },
            {
                path: 'user-tag',
                component: UserTagsComponent,
                data: {
                    title: 'Tags d\'utilisateurs'
                }
            },
            {
                path: 'user-tag/new',
                component: UserTagComponent,
                resolve: {
                    userTag: UserTagResolver,
                },
            },
            {
                path: 'user-tag/:userTagId', // last
                component: UserTagComponent,
                resolve: {
                    userTag: UserTagResolver,
                },
            },
            {
                path: 'user',
                component: UsersComponent,
            },
            {
                path: 'user/new',
                component: UserComponent,
                resolve: {
                    user: UserResolver,
                },
            },
            {
                path: 'user/:userId', // last
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
