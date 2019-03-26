import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/modules/material.module';
import { IchtusModule } from '../shared/modules/ichtus.module';
import { FamilyMemberComponent } from './components/family-member/family-member.component';
import { FamilyComponent } from './components/family/family.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { CreateExpenseClaimComponent } from './components/create-expense-claim/create-expense-claim.component';
import { BookingHistoryComponent } from './components/booking-history/booking-history.component';
import { FinancesComponent } from './components/finances/finances.component';
import { ServicesComponent } from './components/services/services.component';
import { CreateRefundComponent } from './components/create-refund/create-refund.component';
import { ProvisionComponent } from './components/provision/provision.component';

@NgModule({
    declarations: [
        ProfileComponent,
        FamilyMemberComponent,
        FamilyComponent,
        CreateExpenseClaimComponent,
        BookingHistoryComponent,
        FinancesComponent,
        ServicesComponent,
        CreateRefundComponent,
        ProvisionComponent,
    ],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        MaterialModule,
        IchtusModule,
    ],
    entryComponents: [
        CreateRefundComponent,
        ProvisionComponent,
    ],
})
export class ProfileModule {
}
