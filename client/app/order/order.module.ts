import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EmmyModule } from '../shared/modules/emmy.module';
import { OrderLinesComponent } from './order-lines/order-lines.component';
import { OrderComponent } from './order/order.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderLineComponent } from './order-line/order-line.component';

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
        EmmyModule,
    ],
    entryComponents: [
        OrderComponent,
        OrderLineComponent,
    ],
})
export class OrderModule {
}
