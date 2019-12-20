import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArtisansModule } from '../shared/modules/artisans.module';
import { MaterialModule } from '../shared/modules/material.module';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { PasswordComponent } from './components/password/password.component';
import { RegisterConfirmComponent } from './components/register/register-confirm.component';
import { RegisterComponent } from './components/register/register.component';
import { RequestPasswordResetComponent } from './components/request-password-reset/request-password-reset.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
    declarations: [
        RegisterComponent,
        RegisterConfirmComponent,
        RequestPasswordResetComponent,
        ChangePasswordComponent,
        PasswordComponent,
    ],
    imports: [
        CommonModule,
        UserRoutingModule,
        MaterialModule,
        ArtisansModule,
    ],
})
export class UserModule {
}
