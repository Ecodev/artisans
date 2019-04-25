import { NgModule } from '@angular/core';
import { MatDialogConfig } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { TransactionResolver } from '../admin/transactions/services/transaction.resolver';
import { ViewerResolver } from '../admin/users/services/viewer.resolver';
import { OrderResolver } from '../order/services/order.resolver';
import { DialogTriggerComponent } from '../shared/components/modal-trigger/dialog-trigger.component';
import { CreateExpenseClaimComponent } from './components/create-expense-claim/create-expense-claim.component';
import { FamilyComponent } from './components/family/family.component';
import { FinancesComponent } from './components/finances/finances.component';
import { HistoryComponent } from './components/history/history.component';
import { OrderComponent } from '../order/order/order.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
    {
        path: '',
        resolve: {viewer: ViewerResolver},
        children: [
            {
                path: '',
                component: ProfileComponent,
                children: [
                    {
                        path: 'family',
                        component: FamilyComponent,
                    },
                    {
                        path: 'history',
                        component: HistoryComponent,
                        children: [
                            {
                                path: ':transactionId',
                                component: DialogTriggerComponent,
                                resolve: {
                                    order: OrderResolver,
                                },
                                data: {
                                    component: OrderComponent,
                                    escapeRouterLink: ['/profile/history'],
                                    dialogConfig: {
                                        width: '600px',
                                        maxWidth: '95vw',
                                        maxHeight: '97vh',
                                        panelClass: 'big-height-dialog',
                                    } as MatDialogConfig,
                                },
                            },
                        ],
                    },
                    {
                        path: 'finances',
                        component: FinancesComponent,
                    },
                ],
            }, {
                path: 'create-expense-claim',
                component: CreateExpenseClaimComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProfileRoutingModule {
}
