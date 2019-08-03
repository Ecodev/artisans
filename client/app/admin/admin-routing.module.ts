import { NgModule } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { RouterModule, Routes } from '@angular/router';
import { OrderComponent } from '../order/order/order.component';
import { OrdersComponent } from '../order/orders/orders.component';
import { OrderResolver } from '../order/services/order.resolver';
import { DialogTriggerComponent } from '../shared/components/modal-trigger/dialog-trigger.component';
import { UserRole, UserStatus } from '../shared/generated-types';
import { AdministrationGuard } from '../shared/guards/administration.guard';
import { AccountingGuard } from '../shared/guards/accounting.guard';
import { AccountComponent } from './accounts/account/account.component';
import { AccountsComponent } from './accounts/accounts/accounts.component';
import { AccountResolver } from './accounts/services/account.resolver';
import { AdminComponent } from './admin/admin.component';
import { ExpenseClaimComponent } from './expenseClaim/expenseClaim/expenseClaim.component';
import { ExpenseClaimsComponent } from './expenseClaim/expenseClaims/expenseClaims.component';
import { ExpenseClaimParamResolver } from './expenseClaim/services/expenseClaim.param.resolver';
import { ExpenseClaimResolver } from './expenseClaim/services/expenseClaim.resolver';
import { ProductComponent } from './products/product/product.component';
import { ProductsComponent } from './products/products/products.component';
import { ProductResolver } from './products/services/product.resolver';
import { ProductTagComponent } from './productTags/productTag/productTag.component';
import { ProductTagsComponent } from './productTags/productTags/productTags.component';
import { ProductTagResolver } from './productTags/services/productTag.resolver';
import { TransactionResolver } from './transactions/services/transaction.resolver';
import { TransactionComponent } from './transactions/transaction/transaction.component';
import { TransactionLinesComponent } from './transactions/transactionLines/transaction-lines.component';
import { TransactionTagResolver } from './transactionTags/services/transactionTag-resolver.service';
import { TransactionTagComponent } from './transactionTags/transactionTag/transactionTag.component';
import { TransactionTagsComponent } from './transactionTags/transactionTags/transactionTags.component';
import { UserResolver } from './users/services/user.resolver';
import { UserService } from './users/services/user.service';
import { UserComponent } from './users/user/user.component';
import { UsersComponent } from './users/users/users.component';
import { UserTagResolver } from './userTags/services/userTag.resolver';
import { UserTagComponent } from './userTags/userTag/userTag.component';
import { UserTagsComponent } from './userTags/userTags/userTags.component';
import { ImportComponent } from './import/import.component';
import { StockMovementsComponent } from './stockMovement/stockMovements/stockMovements.component';
import { OrderLineComponent } from '../order/order-line/order-line.component';
import { OrderLineResolver } from '../order/services/order-line.resolver';

const routes: Routes = [
        {
            path: '',
            component: AdminComponent,
            canActivate: [AdministrationGuard],
            children: [
                {
                    path: '',
                    pathMatch: 'full',
                    redirectTo: '/admin/product',
                },
                {
                    path: 'product', // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                    component: ProductsComponent,
                    data: {
                        title: 'Produits',
                        isAdmin: true,
                    },
                },
                {
                    path: 'product',
                    children: [
                        {
                            path: 'new',
                            component: ProductComponent,
                            resolve: {
                                product: ProductResolver,
                            },
                        },
                        {
                            path: ':productId', // last
                            component: ProductComponent,
                            resolve: {
                                product: ProductResolver,
                            },
                        },
                    ],
                },
                {
                    path: 'stock-movement',
                    component: StockMovementsComponent,
                    data: {
                        title: 'Mouvements de stock',
                    },
                },
                {
                    path: 'user', // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                    component: UsersComponent,
                    data: {
                        title: 'Tous les utilisateurs',
                        isAdmin: true,
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
                                isAdmin: true,
                                contextVariables: UserService.getFilters([UserRole.member, UserRole.product], [UserStatus.active], true),
                            },
                        },
                        {
                            path: 'newcomer',
                            component: UsersComponent,
                            data: {
                                title: 'Nouveaux membres',
                                isAdmin: true,
                                contextVariables: UserService.getFilters([UserRole.member], [UserStatus.new]),
                                contextColumns: ['balance', 'name', 'status', 'creationDate', 'flagWelcomeSessionDate'],
                            },
                        },
                        {
                            path: 'staff',
                            component: UsersComponent,
                            data: {
                                title: 'Staff',
                                isAdmin: true,
                                contextVariables: UserService.getFilters([UserRole.responsible, UserRole.administrator], null),
                            },
                        },
                        {
                            path: 'non-active',
                            component: UsersComponent,
                            data: {
                                title: 'Membres inactifs et archivés',
                                isAdmin: true,
                                contextVariables: UserService.getFilters([UserRole.member], [UserStatus.inactive, UserStatus.archived]),
                                contextColumns: ['balance', 'name', 'status', 'creationDate', 'resignDate'],
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
                            data: {
                                isAdmin: true,
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
                    path: 'product-tag', // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                    component: ProductTagsComponent,
                    data: {
                        title: 'Tags de produits',
                    },
                },
                {
                    path: 'product-tag',
                    children: [
                        {
                            path: 'new',
                            component: ProductTagComponent,
                            resolve: {
                                productTag: ProductTagResolver,
                            },
                        },
                        {
                            path: ':productTagId', // last
                            component: ProductTagComponent,
                            resolve: {
                                productTag: ProductTagResolver,
                            },
                        },
                    ],
                },
                {
                    path: 'order', // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                    component: OrdersComponent,
                    data: {title: 'Ventes'},
                    children: [
                        {
                            path: ':orderId',
                            component: DialogTriggerComponent,
                            resolve: {
                                order: OrderResolver,
                            },
                            data: {
                                component: OrderComponent,
                                dialogConfig: {
                                    width: '600px',
                                    maxWidth: '95vw',
                                    maxHeight: '97vh',
                                } as MatDialogConfig,
                            },
                        },
                        {
                            path: 'order-line/:orderLineId',
                            component: DialogTriggerComponent,
                            resolve: {
                                orderLine: OrderLineResolver,
                            },
                            data: {
                                component: OrderLineComponent,
                                dialogConfig: {
                                    width: '600px',
                                    maxWidth: '95vw',
                                    maxHeight: '97vh',
                                    autoFocus: false,
                                } as MatDialogConfig,
                            },
                        },
                    ],
                },
                {
                    path: 'transaction',
                    canActivate: [AccountingGuard],
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
                    canActivate: [AccountingGuard],
                    component: TransactionLinesComponent,
                    data: {title: 'Écritures'},
                },
                {
                    path: 'account', // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                    canActivate: [AccountingGuard],
                    component: AccountsComponent,
                    data: {title: 'Comptes'},
                },
                {
                    path: 'account',
                    canActivate: [AccountingGuard],
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
                    canActivate: [AccountingGuard],
                    component: ExpenseClaimsComponent,
                    data: {title: 'Notes de frais'},
                },
                {
                    path: 'expense-claim',
                    canActivate: [AccountingGuard],
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
                    path: 'import',
                    canActivate: [AccountingGuard],
                    component: ImportComponent,
                    data: {title: 'Import des virements BVR'},
                },
                {
                    // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                    path: 'transaction-tag',
                    canActivate: [AccountingGuard],
                    component: TransactionTagsComponent,
                    data: {title: 'Tags de transactions'},
                },
                {
                    path: 'transaction-tag',
                    canActivate: [AccountingGuard],
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
