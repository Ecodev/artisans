import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { BookablesComponent } from './bookables/bookables/bookables.component';
import { BookableComponent } from './bookables/bookable/bookable.component';
import {
    BookablesQueryVariables,
    BookingsQueryVariables,
    BookingStatus,
    BookingType,
    UsersQueryVariables,
} from '../shared/generated-types';
import { LicenseResolver } from './licenses/services/license.resolver';
import { BookableResolver } from './bookables/services/bookable.resolver';
import { LicensesComponent } from './licenses/licenses/licenses.component';
import { LicenseComponent } from './licenses/license/license.component';
import { UserTagsComponent } from './userTags/userTags/userTags.component';
import { UserTagComponent } from './userTags/userTag/userTag.component';
import { UserTagResolver } from './userTags/services/userTag.resolver';
import { BookingsComponent } from './bookings/bookings/bookings.component';
import { UsersComponent } from './users/users/users.component';
import { UserComponent } from './users/user/user.component';
import { UserResolver } from './users/services/user.resolver';
import { BookingComponent } from './bookings/booking/booking.component';
import { BookingResolver } from './bookings/services/booking.resolver';

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: '',
                component: BookingsComponent,
                data: {
                    title: 'Sorties en cours',
                    queryVariables: {
                        filter: {
                            groups: [
                                {
                                    conditions: [{endDate: {null: {not: false}}}],
                                    joins: {bookables: {conditions: [{bookingType: {equal: {value: BookingType.self_approved}}}]}},
                                },
                            ],
                        },
                    } as BookingsQueryVariables,
                },
            },
            {
                path: 'booking',
                component: BookingsComponent,
                data: {
                    title: 'Réservations',
                },
            },
            {
                path: 'booking/application',
                component: BookingsComponent,
                data: {
                    title: 'Demandes',
                    queryVariables: {
                        filter: {
                            groups: [
                                {
                                    conditions: [{status: {equal: {value: BookingStatus.application}}}],
                                },
                            ],
                        },
                    } as BookingsQueryVariables,
                },
            },
            {
                path: 'booking/new',
                component: BookingComponent,
                resolve: {
                    booking: BookingResolver,
                },
            },
            {
                path: 'booking/:bookingId',
                component: BookingComponent,
                resolve: {
                    booking: BookingResolver,
                },
            },
            {
                path: 'bookable',
                children: [
                    {
                        path: 'self-approved',
                        component: BookablesComponent,
                        data: {
                            title: 'Matériel carnet de sortie',
                            queryVariables: {
                                filter: {groups: [{conditions: [{bookingType: {equal: {value: BookingType.self_approved}}}]}]},
                            } as BookablesQueryVariables,
                        },
                    },
                    {
                        path: 'admin-approved',
                        component: BookablesComponent,
                        data: {
                            title: 'Matériel sur demande',
                            queryVariables: {
                                filter: {groups: [{conditions: [{bookingType: {equal: {value: BookingType.admin_approved}}}]}]},
                            } as BookablesQueryVariables,
                        },
                    },
                    {
                        path: 'admin-only',
                        component: BookablesComponent,
                        data: {
                            title: 'Inventaire et services',
                            queryVariables: {
                                filter: {groups: [{conditions: [{bookingType: {equal: {value: BookingType.admin_only}}}]}]},
                            } as BookablesQueryVariables,
                        },
                    },
                    {
                        path: 'mandatory',
                        component: BookablesComponent,
                        data: {
                            title: 'Services obligatoire',
                            queryVariables: {
                                filter: {groups: [{conditions: [{bookingType: {equal: {value: BookingType.mandatory}}}]}]},
                            } as BookablesQueryVariables,
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
                    title: 'Certifications',
                },
            },
            {
                path: 'license/new',
                component: LicenseComponent,
                resolve: {
                    license: LicenseResolver,
                },
            },
            {
                path: 'license/:licenseId',
                component: LicenseComponent,
                resolve: {
                    license: LicenseResolver,
                },
            },
            {
                path: 'user-tag',
                component: UserTagsComponent,
                data: {
                    title: 'Tags d\'utilisateurs',
                },
            },
            {
                path: 'user-tag/new',
                component: UserTagComponent,
                resolve: {
                    userTag: UserTagResolver,
                },
            },
            {
                path: 'user-tag/:userTagId',
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
                path: 'user/:userId',
                component: UserComponent,
                resolve: {
                    user: UserResolver,
                },
            },
            {
                path: 'member',
                component: UsersComponent,
                data: {
                    title: 'Membres',
                    queryVariables: {
                        filter: {
                            groups: [
                                {
                                    conditions: [{responsible: {null: {not: false}}}],
                                    joins: {
                                        bookings: {
                                            joins: {
                                                bookables: {
                                                    conditions: [
                                                        {
                                                            bookingType: {equal: {value: BookingType.mandatory}},
                                                        },
                                                    ],
                                                },
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                    } as UsersQueryVariables,
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
