import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScanComponent } from './components/scan/scan.component';
import { BookingRoutingModule } from './booking-routing.module';
import { EmmyModule } from '../shared/modules/emmy.module';
import { MaterialModule } from '../shared/modules/material.module';
import { ProductComponent } from './product/product.component';
import { CodeInputComponent } from './components/code-input/code-input.component';

@NgModule({
    declarations: [
        ScanComponent,
        ProductComponent,
        CodeInputComponent,
    ],
    imports: [
        CommonModule,
        BookingRoutingModule,
        EmmyModule,
        MaterialModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class BookingModule {
}
