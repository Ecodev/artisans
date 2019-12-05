import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArtisansModule } from '../shared/modules/artisans.module';
import { OrderLineComponent } from './order-line/order-line.component';
import { OrderLinesComponent } from './order-lines/order-lines.component';
import { OrderComponent } from './order/order.component';
import { OrdersComponent } from './orders/orders.component';

const declarations = [
    OrderComponent,
    OrdersComponent,
    OrderLinesComponent,
    OrderLineComponent,
];

@NgModule({
    declarations: [...declarations],
    exports: [...declarations],
    imports: [
        CommonModule,
        ArtisansModule,
    ],
    entryComponents: [
        OrderComponent,
        OrderLineComponent,
    ],
})
export class OrderModule {
}
