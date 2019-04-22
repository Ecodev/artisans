import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewerResolver } from './admin/users/services/viewer.resolver';
import { FrontEndComponent } from './front-end/front-end.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './shared/components/error/error.component';
import { ModalTriggerComponent } from './shared/components/modal-trigger/modal-trigger.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { CodeInputComponent } from './shop/code-input/code-input.component';
import { ProductComponent } from './shop/product/product.component';
import { ScanComponent } from './shop/scan/scan.component';
import { ProductByCodeResolver } from './shop/services/product-by-code.resolver';
import { ShopComponent } from './shop/shop/shop.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        resolve: {viewer: ViewerResolver},
    },
    {
        // Registration
        path: 'user',
        component: HomeComponent,
        loadChildren: './user/user.module#UserModule',
    },
    // Auth required routes
    {
        path: '',
        component: HomeComponent,
        resolve: {viewer: ViewerResolver},
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                component: FrontEndComponent,
                children: [
                    {
                        path: '',
                        component: ShopComponent,
                        children: [
                            {
                                path: 'product/:code',
                                component: ModalTriggerComponent,
                                data: {
                                    component: ProductComponent,
                                    width: 600,
                                },
                                resolve: {
                                    product: ProductByCodeResolver,
                                },
                            },
                            {
                                path: 'by-scan',
                                component: ScanComponent,
                            },
                            {
                                path: 'by-code',
                                component: CodeInputComponent,
                            },
                        ],
                    },
                    {
                        path: 'profile',
                        loadChildren: './profile/profile.module#ProfileModule',
                    },
                ],
            },
            {
                path: 'admin',
                loadChildren: './admin/admin.module#AdminModule',
            },

        ],
    },
    {
        path: 'error',
        component: HomeComponent,
        children: [
            {
                path: '',
                component: ErrorComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            paramsInheritanceStrategy: 'always',
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
