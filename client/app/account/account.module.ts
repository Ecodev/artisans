import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './components/account/account.component';
import { AccountRoutingModule } from './account-routing.module';
import { SignupComponent } from './components/signup/signup.component';
import { MaterialModule } from '../shared/modules/material.module';
import { IchtusModule } from '../shared/modules/ichtus.module';
import { FamilyMemberComponent } from './components/family-member/family-member.component';
import { FamilyComponent } from './components/family/family.component';

@NgModule({
    declarations: [
        AccountComponent,
        SignupComponent,
        FamilyMemberComponent,
        FamilyComponent,
    ],
    imports: [
        CommonModule,
        AccountRoutingModule,
        MaterialModule,
        IchtusModule,
    ],
})
export class AccountModule {
}
