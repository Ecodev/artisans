import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { BookablesComponent } from './bookables/bookables/bookables.component';
import { BookableComponent } from './bookables/bookable/bookable.component';
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
import { BookingService } from './bookings/services/booking.service';
import { UserService } from './users/services/user.service';
import { BookableService } from './bookables/services/bookable.service';
import { BookableTagsComponent } from './bookableTags/bookableTags/bookableTags.component';
import { BookableTagComponent } from './bookableTags/bookableTag/bookableTag.component';
import { BookableTagResolver } from './bookableTags/services/bookableTag.resolver';
import { UserRole, UserStatus } from '../shared/generated-types';
import { TransactionResolver } from './transactions/services/transaction.resolver';
import { TransactionComponent } from './transactions/transaction/transaction.component';
import { AccountsComponent } from './accounts/accounts/accounts.component';
import { AccountComponent } from './accounts/account/account.component';
import { AccountResolver } from './accounts/services/account.resolver';
import { ExpenseClaimsComponent } from './expenseClaim/expenseClaims/expenseClaims.component';
import { ExpenseClaimComponent } from './expenseClaim/expenseClaim/expenseClaim.component';
import { ExpenseClaimResolver } from './expenseClaim/services/expenseClaim.resolver';
import { TransactionTagsComponent } from './transactionTags/transactionTags/transactionTags.component';
import { TransactionTagComponent } from './transactionTags/transactionTag/transactionTag.component';
import { TransactionTagResolver } from './transactionTags/services/transactionTag-resolver.service';
import { AdministrationGuard } from '../shared/services/administration.guard';
import { TransactionLinesComponent } from './transactions/transactionLines/transactionLines.component';
import { ExpenseClaimParamResolver } from './expenseClaim/services/expenseClaim.param.resolver';

const routes: Routes = [
        {
            path: '',
            component: AdminComponent,
            canActivate: [AdministrationGuard],
            children: [
                {
                    path: '',
                    component: BookingsComponent,
                    data: {
                        title: 'Sorties en cours',
                        queryVariables: BookingService.runningSelfApprovedQV,
                        columns: ['edit', 'owner', 'bookable', 'startDate', 'estimatedEndDate', 'terminateBooking'],
                    },
                },
                {
                    path: 'booking', // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                    component: BookingsComponent,
                    data: {title: 'Réservations'},
                },
                {
                    path: 'booking',
                    children: [
                        {
                            path: 'self-approved',
                            component: BookingsComponent,
                            data: {
                                title: 'Toutes terminées',
                                queryVariables: BookingService.selfApprovedQV,
                                columns: [
                                    'edit',
                                    'owner',
                                    'bookable',
                                    'destination',
                                    'startDate',
                                    'endDate',
                                    'participantCount',
                                    'endComment',
                                ],

                            },
                        },
                        {
                            path: 'storage-application',
                            component: BookingsComponent,
                            data: {
                                title: 'Demandes de stockage en attente',
                                queryVariables: BookingService.storageApplication,
                                columns: ['edit', 'owner', 'bookable', 'startDate'],
                            },
                        },
                        {
                            path: 'other-application',
                            component: BookingsComponent,
                            data: {
                                title: 'Demandes de services en attente',
                                queryVariables: BookingService.notStorageApplication,
                                columns: ['edit', 'owner', 'bookable', 'startDate'],
                            },
                        },
                        {
                            path: 'new',
                            component: BookingComponent,
                            resolve: {
                                booking: BookingResolver,
                            },
                        },
                        {
                            path: ':bookingId', // last
                            component: BookingComponent,
                            resolve: {
                                booking: BookingResolver,
                            },
                        },
                    ],
                },
                {
                    path: 'bookable', // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                    component: BookablesComponent,
                    data: {title: 'Réservables'},
                },
                {
                    path: 'bookable',
                    children: [
                        {
                            path: 'services',
                            component: BookablesComponent,
                            data: {
                                title: 'Cotisations',
                                queryVariables: BookableService.membershipServices,
                            },
                        },
                        {
                            path: 'sup',
                            component: BookablesComponent,
                            data: {
                                title: 'Stand up paddle',
                                queryVariables: BookableService.getFiltersByTagId(6000),
                                columns: ['image', 'name', 'code', 'date', 'verificationDate'],
                            },
                        },
                        {
                            path: 'planche',
                            component: BookablesComponent,
                            data: {
                                title: 'Planches',
                                queryVariables: BookableService.getFiltersByTagId(6001),
                                columns: ['image', 'name', 'code', 'date', 'verificationDate'],
                            },
                        },
                        {
                            path: 'canoe',
                            component: BookablesComponent,
                            data: {
                                title: 'Canoës',
                                queryVariables: BookableService.getFiltersByTagId(6002),
                                columns: ['image', 'name', 'code', 'date', 'verificationDate'],
                            },
                        },
                        {
                            path: 'kayak',
                            component: BookablesComponent,
                            data: {
                                title: 'Kayaks',
                                queryVariables: BookableService.getFiltersByTagId(6003),
                                columns: ['image', 'name', 'code', 'date', 'verificationDate'],
                            },
                        },
                        {
                            path: 'aviron',
                            component: BookablesComponent,
                            data: {
                                title: 'Aviron',
                                queryVariables: BookableService.getFiltersByTagId(6004),
                                columns: ['image', 'name', 'code', 'date', 'verificationDate'],
                            },
                        },
                        {
                            path: 'voile-legere',
                            component: BookablesComponent,
                            data: {
                                title: 'Voile légère',
                                queryVariables: BookableService.getFiltersByTagId(6005),
                                columns: ['image', 'name', 'code', 'date', 'verificationDate'],
                            },
                        },
                        {
                            path: 'voile-lestee',
                            component: BookablesComponent,
                            data: {
                                title: 'Voile lestée',
                                queryVariables: BookableService.getFiltersByTagId(6006),
                                columns: ['image', 'name', 'code', 'date', 'verificationDate'],
                            },
                        },
                        {
                            path: 'armoire',
                            component: BookablesComponent,
                            data: {
                                title: 'Armoires',
                                queryVariables: BookableService.adminByTag(6009),
                            },
                        },
                        {
                            path: 'casier',
                            component: BookablesComponent,
                            data: {
                                title: 'Casiers',
                                queryVariables: BookableService.adminByTag(6010),
                            },
                        },
                        {
                            path: 'flotteur',
                            component: BookablesComponent,
                            data: {
                                title: 'Flotteurs',
                                queryVariables: BookableService.adminByTag(6011),
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
                            path: ':bookableId', // last
                            component: BookableComponent,
                            resolve: {
                                bookable: BookableResolver,
                            },
                        },
                    ],
                },
                {
                    path: 'user', // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                    component: UsersComponent,
                    data: {
                        title: 'Tous les utilisateurs',
                    },
                },
                {
                    path: 'user',
                    children: [
                        {
                            path: 'member',
                            component: UsersComponent,
                            data: {
                                title: 'Membres actifs',
                                queryVariables: UserService.getFilters([UserRole.member], [UserStatus.active]),
                            },
                        },
                        {
                            path: 'newcomer',
                            component: UsersComponent,
                            data: {
                                title: 'Nouveaux membres',
                                queryVariables: UserService.getFilters([UserRole.member], [UserStatus.new]),
                                columns: ['name', 'status', 'creationDate', 'flagWelcomeSessionDate'],
                            },
                        },
                        {
                            path: 'staff',
                            component: UsersComponent,
                            data: {
                                title: 'Staff',
                                queryVariables: UserService.getFilters([UserRole.responsible, UserRole.administrator], null),
                            },
                        },
                        {
                            path: 'non-active',
                            component: UsersComponent,
                            data: {
                                title: 'Membres inactifs et archivés',
                                queryVariables: UserService.getFilters([UserRole.member], [UserStatus.inactive, UserStatus.archived]),
                            },
                        },

                        {
                            path: 'new',
                            component: UserComponent,
                            resolve: {
                                user: UserResolver,
                            },
                        },
                        {
                            path: ':userId', // last
                            component: UserComponent,
                            resolve: {
                                user: UserResolver,
                            },
                        },
                    ],
                },
                {
                    path: 'license', // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                    component: LicensesComponent,
                    data: {
                        title: 'Certifications',
                    },
                },
                {
                    path: 'license',
                    children: [
                        {
                            path: 'new',
                            component: LicenseComponent,
                            resolve: {
                                license: LicenseResolver,
                            },
                        },
                        {
                            path: ':licenseId', // last
                            component: LicenseComponent,
                            resolve: {
                                license: LicenseResolver,
                            },
                        },
                    ],
                },
                {
                    path: 'user-tag', // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                    component: UserTagsComponent,
                    data: {
                        title: 'Tags d\'utilisateurs',
                    },
                },
                {
                    path: 'user-tag',
                    children: [
                        {
                            path: 'new',
                            component: UserTagComponent,
                            resolve: {
                                userTag: UserTagResolver,
                            },
                        },
                        {
                            path: ':userTagId', // last
                            component: UserTagComponent,
                            resolve: {
                                userTag: UserTagResolver,
                            },
                        },
                    ],
                },
                {
                    path: 'bookable-tag', // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                    component: BookableTagsComponent,
                    data: {
                        title: 'Tags de réservables',
                    },
                },
                {
                    path: 'bookable-tag',
                    children: [
                        {
                            path: 'new',
                            component: BookableTagComponent,
                            resolve: {
                                bookableTag: BookableTagResolver,
                            },
                        },
                        {
                            path: ':bookableTagId', // last
                            component: BookableTagComponent,
                            resolve: {
                                bookableTag: BookableTagResolver,
                            },
                        },
                    ],
                },
                {
                    path: 'transaction',
                    children: [
                        {
                            path: 'new',
                            component: TransactionComponent,
                            resolve: {
                                transaction: TransactionResolver,
                                expenseClaim: ExpenseClaimParamResolver,
                            },
                        },
                        {
                            path: ':transactionId', // last
                            component: TransactionComponent,
                            resolve: {
                                transaction: TransactionResolver,
                            },
                        },
                    ],
                },
                {
                    path: 'transaction-line', // Separated from other similar routes because of
                                              // https://github.com/angular/angular/issues/27674
                    component: TransactionLinesComponent,
                    data: {title: 'Écritures'},
                },
                {
                    path: 'account', // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                    component: AccountsComponent,
                    data: {title: 'Comptes'},
                },
                {
                    path: 'account',
                    children: [
                        {
                            path: 'new',
                            component: AccountComponent,
                            resolve: {
                                account: AccountResolver,
                            },
                        },
                        {
                            path: ':accountId', // last
                            component: AccountComponent,
                            resolve: {
                                account: AccountResolver,
                            },
                        },
                    ],
                },
                {
                    path: 'expense-claim', // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                    component: ExpenseClaimsComponent,
                    data: {title: 'Notes de frais'},
                },
                {
                    path: 'expense-claim',
                    children: [
                        {
                            path: 'new',
                            component: ExpenseClaimComponent,
                            resolve: {
                                expenseClaim: ExpenseClaimResolver,
                            },
                        },
                        {
                            path: ':expenseClaimId', // last
                            component: ExpenseClaimComponent,
                            resolve: {
                                expenseClaim: ExpenseClaimResolver,
                            },
                        },
                    ],
                },
                {
                    // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                    path: 'transaction-tag',
                    component: TransactionTagsComponent,
                    data: {title: 'Tags'},
                },
                {
                    path: 'transaction-tag',
                    children: [
                        {
                            path: 'new',
                            component: TransactionTagComponent,
                            resolve: {
                                transactionTag: TransactionTagResolver,
                            },
                        },
                        {
                            path: ':transactionTagId', // last
                            component: TransactionTagComponent,
                            resolve: {
                                transactionTag: TransactionTagResolver,
                            },
                        },
                    ],
                },
            ],
        },
    ]
;

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {
}
