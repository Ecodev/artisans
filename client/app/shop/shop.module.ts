import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EmmyModule } from '../shared/modules/emmy.module';
import { CodeInputComponent } from './code-input/code-input.component';
import { ProductComponent } from './product/product.component';
import { CameraComponent } from './camera/camera.component';
import { ShopComponent } from './shop/shop.component';

@NgModule({
    declarations: [
        ShopComponent,
        CameraComponent,
        CodeInputComponent,
        ProductComponent,
    ],
    imports: [
        CommonModule,
        EmmyModule,
    ],
})
export class ShopModule {
}
