import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewerResolver } from '../admin/users/services/viewer.resolver';
import { ProfileComponent } from './components/profile/profile.component';
import { UserByTokenResolver } from '../admin/users/services/userByToken.resolver';
import { CreateExpenseClaimComponent } from './components/create-expense-claim/create-expense-claim.component';
import { FamilyComponent } from './components/family/family.component';
import { BookingHistoryComponent } from './components/booking-history/booking-history.component';
import { FinancesComponent } from './components/finances/finances.component';
import { ServicesComponent } from './components/services/services.component';
import { RegisterComponent } from '../user/components/register/register.component';
import { RegisterConfirmComponent } from '../user/components/register/register-confirm.component';

const routes: Routes = [
    {
        path: '',
        resolve: {
            user: ViewerResolver,
        },
        children: [
            {
                path: '',
                component: ProfileComponent,
                children: [
                    {
                        path: '',
                        component: BookingHistoryComponent,
                    },
                    {
                        path: 'family',
                        component: FamilyComponent,
                    },
                    {
                        path: 'finances',
                        component: FinancesComponent,
                    },
                    {
                        path: 'services',
                        component: ServicesComponent,
                    },
                ],
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
