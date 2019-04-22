import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewerResolver } from '../admin/users/services/viewer.resolver';
import { ProfileComponent } from './components/profile/profile.component';
import { FamilyComponent } from './components/family/family.component';
import { FinancesComponent } from './components/finances/finances.component';
import { CreateExpenseClaimComponent } from './components/create-expense-claim/create-expense-claim.component';
import { HistoryComponent } from './components/history/history.component';

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
                        path: '',
                    },
                    {
                        path: 'family',
                        component: FamilyComponent,
                    },
                    {
                        path: 'history',
                        component: HistoryComponent,
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
