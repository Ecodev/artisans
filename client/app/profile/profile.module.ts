import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/modules/material.module';
import { EmmyModule } from '../shared/modules/emmy.module';
import { FamilyMemberComponent } from './components/family-member/family-member.component';
import { FamilyComponent } from './components/family/family.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { CreateExpenseClaimComponent } from './components/create-expense-claim/create-expense-claim.component';
import { BookingHistoryComponent } from './components/booking-history/booking-history.component';
import { ServicesComponent } from './components/services/services.component';
import { CreateRefundComponent } from './components/create-refund/create-refund.component';
import { ProvisionComponent } from './components/provision/provision.component';
import { SelectAdminApprovedModalComponent } from '../shared/components/select-admin-approved-modal/select-admin-approved-modal.component';
import {
    SelectAdminApprovedButtonComponent
} from '../shared/components/select-admin-approved-button/select-admin-approved-button.component';
import { HistoryComponent } from './components/history/history.component';
import { FinancesComponent } from './components/finances/finances.component';

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
        SelectAdminApprovedButtonComponent,
        SelectAdminApprovedModalComponent,
        HistoryComponent,
    ],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        MaterialModule,
        EmmyModule,
    ],
    entryComponents: [
        CreateRefundComponent,
        ProvisionComponent,
        SelectAdminApprovedModalComponent,
    ],
    exports: [
        ServicesComponent,
        FinancesComponent,
    ],
})
export class ProfileModule {
}
