import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { AccountComponent } from './components/account/account.component';
import { ViewerResolver } from '../admin/users/services/viewer.resolver';

const routes: Routes = [
    {
        path: '',
        component: AccountComponent,
        resolve: {
            user: ViewerResolver,
        },
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
