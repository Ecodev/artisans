import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BvrComponent } from './components/bvr/bvr.component';
import { ArtisansModule } from '../../../shared/modules/artisans.module';

import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './components/cart/cart.component';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { ssrCompatibleStorageProvider } from '../../../shared/utils';

@NgModule({
    declarations: [CartComponent, CreateOrderComponent, BvrComponent],
    imports: [
        CommonModule,
        CartRoutingModule,
        ArtisansModule,
    ],
    providers: [
        ssrCompatibleStorageProvider,
    ],
})
export class CartModule {
}
