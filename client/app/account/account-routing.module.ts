import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { AccountWrapperComponent } from './components/account-wrapper/account-wrapper.component';
import { AccountComponent } from './components/account/account.component';

const routes: Routes = [
    {
        path: '',
        component: AccountWrapperComponent,
        children : [
            {
                path: '',
                component: AccountComponent
            },
            {
                path: 'familly',
            }
        ]
    },
    {
        path: 'new',
        component: SignupComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AccountRoutingModule {
}
