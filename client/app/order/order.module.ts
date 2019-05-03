import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EmmyModule } from '../shared/modules/emmy.module';
import { OrderLinesComponent } from './order-lines/order-lines.component';
import { OrderComponent } from './order/order.component';
import { OrdersComponent } from './orders/orders.component';

const declarations = [
    OrderComponent,
    OrdersComponent,
    OrderLinesComponent,
];

@NgModule({
    declarations: [...declarations],
    exports: [...declarations],
    imports: [
        CommonModule,
        EmmyModule
    ],
    entryComponents: [
        OrderComponent
    ]
})
export class OrderModule {
}
