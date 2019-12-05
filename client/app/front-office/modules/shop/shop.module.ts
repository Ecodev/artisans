import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArtisansModule } from '../../../shared/modules/artisans.module';
import { CartModule } from '../cart/cart.module';
import { AddToCartComponent } from './components/add-to-cart/add-to-cart.component';
import { ProductComponent } from './components/product/product.component';
import { ProductsComponent } from './components/products/products.component';
import { ShopRoutingModule } from './shop-routing.module';

@NgModule({
    declarations: [
        ProductComponent,
        AddToCartComponent,
        ProductsComponent,
    ],
    imports: [
        CommonModule,
        ArtisansModule,
        ShopRoutingModule,
        CartModule,
    ],
    entryComponents: [
        ProductComponent,
    ],
})
export class ShopModule {
}
