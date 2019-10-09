import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArtisansModule } from '../shared/modules/artisans.module';
import { ProductComponent } from './product/product.component';
import { ShopComponent } from './shop/shop.component';

@NgModule({
    declarations: [
        ShopComponent,
        ProductComponent,
    ],
    imports: [
        CommonModule,
        ArtisansModule,
    ],
    entryComponents: [
        ProductComponent,
    ],
})
export class ShopModule {
}
