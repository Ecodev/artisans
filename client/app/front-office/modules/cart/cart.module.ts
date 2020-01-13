import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArtisansModule } from '../../../shared/modules/artisans.module';

import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './components/cart/cart.component';
import { CreateOrderComponent } from './components/create-order/create-order.component';

@NgModule({
    declarations: [CartComponent, CreateOrderComponent],
    imports: [
        CommonModule,
        CartRoutingModule,
        ArtisansModule,
    ],
})
export class CartModule {
}
