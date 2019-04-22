import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModalTriggerComponent } from '../shared/components/modal-trigger/modal-trigger.component';
import { CodeInputComponent } from './code-input/code-input.component';
import { ProductComponent } from './product/product.component';
import { ScanComponent } from './scan/scan.component';
import { ProductByCodeResolver } from './services/product-by-code.resolver';
import { ShopComponent } from './shop/shop.component';

const routes: Routes = [
    {
        path: '',
        component: ShopComponent,
        children: [
            {
                path: 'product/:code',
                component: ModalTriggerComponent,
                data: {
                    component: ProductComponent,
                },
                resolve: {
                    product: ProductByCodeResolver,
                },
            },
        ],
    },
    {
        path: 'by-scan',
        component: ScanComponent,
    },
    {
        path: 'by-code',
        component: CodeInputComponent,
    },
    {
        path: ':productCode',
        component: ProductComponent,
        resolve: {
            product: ProductByCodeResolver,
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ShopRoutingModule {
}
