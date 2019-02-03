import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProfileRoutingModule {
}
