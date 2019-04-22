import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScanComponent } from './components/scan/scan.component';
import { ProductComponent } from './product/product.component';
import { ProductByCodeResolver } from './product/product-by-code.resolver';
import { CodeInputComponent } from './components/code-input/code-input.component';

const routes: Routes = [
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
export class BookingRoutingModule {
}
