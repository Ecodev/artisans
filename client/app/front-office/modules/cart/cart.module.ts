import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArtisansModule } from '../../../shared/modules/artisans.module';

import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './components/cart/cart.component';

@NgModule({
    declarations: [CartComponent],
    imports: [
        CommonModule,
        CartRoutingModule,
        ArtisansModule,
    ],
})
export class CartModule {
}
