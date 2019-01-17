import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { ViewerResolver } from '../admin/users/services/viewer.resolver';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
    {
        path: '',
        component: ProfileComponent,
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
export class ProfileRoutingModule {
}
