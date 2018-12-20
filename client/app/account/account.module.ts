import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FamillyComponent } from './components/familly/familly.component';
import { FamillyMemberComponent } from './components/familly-member/familly-member.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AccountComponent } from './components/account/account.component';
import { AccountRoutingModule } from './account-routing.module';
import { SignupComponent } from './components/signup/signup.component';
import { AccountWrapperComponent } from './components/account-wrapper/account-wrapper.component';
import { MaterialModule } from '../shared/modules/material.module';
import { IchtusModule } from '../shared/modules/ichtus.module';
import { AddressComponent } from '../shared/components/address/address.component';

@NgModule({
    declarations: [
        FamillyComponent,
        FamillyMemberComponent,
        ProfileComponent,
        AccountComponent,
        SignupComponent,
        AccountWrapperComponent,
        AddressComponent
    ],
    imports: [
        CommonModule,
        AccountRoutingModule,
        MaterialModule,
        IchtusModule
    ],
})
export class AccountModule {
}
