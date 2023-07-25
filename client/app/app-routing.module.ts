import {Routes} from '@angular/router';
import {resolveViewer} from './admin/users/services/viewer.resolver';
import {FrontOfficeComponent} from './front-office/front-office.component';
import {ErrorComponent} from './shared/components/error/error.component';

export const routes: Routes = [
    {
        // This must be as independent as possible, because there is a risk of infinite loop if there is an error when
        // resolving something to show the error component, then redirecting to the error component, then failing again, etc.
        path: 'error',
        component: ErrorComponent,
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin/admin-routing.module').then(m => m.routes),
    },
    {
        // Registration
        path: 'user',
        component: FrontOfficeComponent,
        loadChildren: () => import('./user/user-routing.module').then(m => m.routes),
    },
    {
        path: '',
        component: FrontOfficeComponent,
        resolve: {viewer: resolveViewer},
        loadChildren: () => import('./front-office/front-office-routing.module').then(m => m.routes),
    },
];
