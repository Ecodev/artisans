import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScanComponent } from './components/scan/scan.component';
import { BookingRoutingModule } from './booking-routing.module';
import { IchtusModule } from '../shared/modules/ichtus.module';
import { MaterialModule } from '../shared/modules/material.module';
import { BookableComponent } from './bookable/bookable.component';

@NgModule({
    declarations: [
        ScanComponent,
        BookableComponent,
    ],
    imports: [
        CommonModule,
        BookingRoutingModule,
        IchtusModule,
        MaterialModule,
    ],
})
export class BookingModule {
}
