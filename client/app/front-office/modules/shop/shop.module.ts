import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArtisansModule } from '../../../shared/modules/artisans.module';
import { CartModule } from '../cart/cart.module';
import { AddToCartComponent } from './components/add-to-cart/add-to-cart.component';
import { ProductComponent } from './components/product/product.component';
import { ProductsPageComponent } from './components/products/products-page.component';
import { SubscribeComponent } from './components/subscribe/subscribe.component';
import { SubscriptionsComponent } from './components/subscriptions/subscriptions.component';
import { ShopRoutingModule } from './shop-routing.module';

@NgModule({
    declarations: [
        ProductComponent,
        AddToCartComponent,
        ProductsPageComponent,
        SubscribeComponent,
        SubscriptionsComponent,
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
