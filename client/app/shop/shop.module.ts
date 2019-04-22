import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EmmyModule } from '../shared/modules/emmy.module';
import { CodeInputComponent } from './code-input/code-input.component';
import { ProductComponent } from './product/product.component';
import { ScanComponent } from './scan/scan.component';
import { ShopRoutingModule } from './shop-routing.module';
import { ShopComponent } from './shop/shop.component';

@NgModule({
    declarations: [
        ShopComponent,
        ScanComponent,
        CodeInputComponent,
        ProductComponent,
    ],
    imports: [
        CommonModule,
        ShopRoutingModule,
        EmmyModule,
    ],
})
export class ShopModule {
}
