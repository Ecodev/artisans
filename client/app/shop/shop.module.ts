import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EmmyModule } from '../shared/modules/emmy.module';
import { ProductComponent } from './product/product.component';
import { CameraComponent } from './camera/camera.component';
import { ShopComponent } from './shop/shop.component';

@NgModule({
    declarations: [
        ShopComponent,
        CameraComponent,
        ProductComponent,
    ],
    imports: [
        CommonModule,
        EmmyModule,
    ],
    entryComponents: [
        CameraComponent,
        ProductComponent,
    ],
})
export class ShopModule {
}
