import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/modules/material.module';
import { IchtusModule } from '../shared/modules/ichtus.module';
import { FamilyMemberComponent } from './components/family-member/family-member.component';
import { FamilyComponent } from './components/family/family.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
<<<<<<< HEAD
=======
import { RegisterConfirmComponent } from './components/register/register-confirm.component';
import { CreateExpenseClaimComponent } from './components/create-expense-claim/create-expense-claim.component';
import { BookingHistoryComponent } from './components/booking-history/booking-history.component';
import { FinancesComponent } from './components/finances/finances.component';
import { ServicesComponent } from './components/services/services.component';
>>>>>>> Review profile page #6038

@NgModule({
    declarations: [
        ProfileComponent,
        FamilyMemberComponent,
        FamilyComponent,
        CreateExpenseClaimComponent,
        BookingHistoryComponent,
        FinancesComponent,
        ServicesComponent,
    ],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        MaterialModule,
        IchtusModule,
    ],
})
export class ProfileModule {
}
