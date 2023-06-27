import {Routes} from '@angular/router';
import {resolveViewer} from './admin/users/services/viewer.resolver';
import {FrontOfficeComponent} from './front-office/front-office.component';

export const routes: Routes = [
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
