import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './components/register/register.component';
import { MaterialModule } from '../shared/modules/material.module';
import { IchtusModule } from '../shared/modules/ichtus.module';
import { FamilyMemberComponent } from './components/family-member/family-member.component';
import { FamilyComponent } from './components/family/family.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { RegisterConfirmComponent } from './components/register/register-confirm.component';

@NgModule({
    declarations: [
        ProfileComponent,
        RegisterComponent,
        RegisterConfirmComponent,
        FamilyMemberComponent,
        FamilyComponent,
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
