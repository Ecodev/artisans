import { Injectable } from '@angular/core';
import { Literal, NaturalAbstractModelService, NaturalQueryVariablesManager } from '@ecodev/natural';
import { Apollo } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateOrder, CreateOrderVariables, Order, Orders, OrdersVariables, OrderVariables } from '../../shared/generated-types';
import { OrderLineService } from './order-lines.service';
import { createOrder, orderQuery, ordersQuery } from './order.queries';

@Injectable({
    providedIn: 'root',
})
export class OrderService extends NaturalAbstractModelService<Order['order'],
    OrderVariables,
    Orders['orders'],
    OrdersVariables,
    CreateOrder['createOrder'],
    CreateOrderVariables,
    any,
    any,
    any> {

    constructor(apollo: Apollo, private orderLineService: OrderLineService) {
        super(apollo,
            'order',
            orderQuery,
            ordersQuery,
            createOrder,
            null,
            null);
    }

    public getInput(object: Literal) {
        return (object as CreateOrderVariables['input']).map(line => this.orderLineService.getInput(line));
    }

}
