import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { ProductsComponent } from './products/products/products.component';
import { ProductComponent } from './products/product/product.component';
import { ProductResolver } from './products/services/product.resolver';
import { TransactionsComponent } from './transactions/transactions/transactions.component';
import { UserTagsComponent } from './userTags/userTags/userTags.component';
import { UserTagComponent } from './userTags/userTag/userTag.component';
import { UserTagResolver } from './userTags/services/userTag.resolver';
import { UsersComponent } from './users/users/users.component';
import { UserComponent } from './users/user/user.component';
import { UserResolver } from './users/services/user.resolver';
import { UserService } from './users/services/user.service';
import { ProductTagsComponent } from './productTags/productTags/productTags.component';
import { ProductTagComponent } from './productTags/productTag/productTag.component';
import { ProductTagResolver } from './productTags/services/productTag.resolver';
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
import { TransactionLinesComponent } from './transactions/transactionLines/transactionLines.component';
import { ExpenseClaimParamResolver } from './expenseClaim/services/expenseClaim.param.resolver';
import { AdministrationGuard } from '../shared/guards/administration.guard';

const routes: Routes = [
        {
            path: '',
            component: AdminComponent,
            canActivate: [AdministrationGuard],
            children: [
                {
                    path: '',
                    pathMatch: 'full',
                    redirectTo: '/admin/product'
                },
                {
                    path: 'product', // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                    component: ProductsComponent,
                    data: {title: 'Produits'},
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
                                contextVariables: UserService.getFilters([UserRole.member], [UserStatus.active]),
                            },
                        },
                        {
                            path: 'newcomer',
                            component: UsersComponent,
                            data: {
                                title: 'Nouveaux membres',
                                contextVariables: UserService.getFilters([UserRole.member], [UserStatus.new]),
                                contextColumns: ['balance', 'name', 'status', 'creationDate', 'flagWelcomeSessionDate'],
                            },
                        },
                        {
                            path: 'staff',
                            component: UsersComponent,
                            data: {
                                title: 'Staff',
                                contextVariables: UserService.getFilters([UserRole.responsible, UserRole.administrator], null),
                            },
                        },
                        {
                            path: 'non-active',
                            component: UsersComponent,
                            data: {
                                title: 'Membres inactifs et archivés',
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
                    path: 'transaction', // Separated from other similar routes because of https://github.com/angular/angular/issues/27674
                    component: TransactionsComponent,
                    data: {title: 'Transactions'},
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
                    data: {title: 'Tags de transactions'},
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
