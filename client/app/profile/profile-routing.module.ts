import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { ViewerResolver } from '../admin/users/services/viewer.resolver';
import { ProfileComponent } from './components/profile/profile.component';
import { SignUpConfirmComponent } from './components/signup/signup-confirm.component';

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
        data: {
            step: 1,
        },
    },
    {
        path: 'confirm/:userToken',
        component: SignUpConfirmComponent,
        data: {
            step: 2,
            user: {model: {id: 1004, email: 'tartempion@perlinpinpin.com'}}, // TODO remove when using resolve
        },
        resolve: {
            // TODO : Need a way resolve a user from FE (that has no permissions, considering parameter sent by confirmation e-mail)
            // user: UserTokenResolver
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProfileRoutingModule {
}
