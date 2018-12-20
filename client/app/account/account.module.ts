import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FamillyComponent } from './components/familly/familly.component';
import { FamillyMemberComponent } from './components/familly-member/familly-member.component';
import { AccountComponent } from './components/account/account.component';
import { AccountRoutingModule } from './account-routing.module';
import { SignupComponent } from './components/signup/signup.component';
import { MaterialModule } from '../shared/modules/material.module';
import { IchtusModule } from '../shared/modules/ichtus.module';

@NgModule({
    declarations: [
        FamillyComponent,
        FamillyMemberComponent,
        AccountComponent,
        SignupComponent,
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
