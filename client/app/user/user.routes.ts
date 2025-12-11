import {Routes} from '@angular/router';
import {NaturalSeo} from '@ecodev/natural';
import {resolveUserByToken} from '../admin/users/services/userByToken.resolver';
import {ChangePasswordComponent} from './components/change-password/change-password.component';
import {RegisterConfirmComponent} from './components/register/register-confirm.component';
import {RegisterComponent} from './components/register/register.component';
import {RequestPasswordResetComponent} from './components/request-password-reset/request-password-reset.component';

export const routes: Routes = [
    {
        path: 'new',
        component: RegisterComponent,
        data: {
            seo: {
                title: `Créer un compte`,
            } satisfies NaturalSeo,
        },
    },
    {
        path: 'confirm/:token',
        component: RegisterConfirmComponent,
        resolve: {
            user: resolveUserByToken,
        },
        data: {
            seo: {
                title: `Confirmation du compte`,
            } satisfies NaturalSeo,
        },
    },
    {
        path: 'request-password-reset',
        component: RequestPasswordResetComponent,
        data: {
            seo: {
                title: `Demande de changement de mot de passe`,
            } satisfies NaturalSeo,
        },
    },
    {
        path: 'change-password/:token',
        component: ChangePasswordComponent,
        resolve: {
            user: resolveUserByToken,
        },
        data: {
            seo: {
                title: `Changement de mot de passe`,
            } satisfies NaturalSeo,
        },
    },
];
