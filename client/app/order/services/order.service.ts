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

    public resolveByTransaction(transactionId: string): Observable<{ model: any }> {

        if (transactionId) {
            const qvm = new NaturalQueryVariablesManager<OrdersVariables>();
            const variables: OrdersVariables = {
                filter: {groups: [{conditions: [{transaction: {equal: {value: transactionId}}}]}]},
            };
            qvm.set('variables', variables);

            return this.getAll(qvm).pipe(map(result => {
                return {model: result && result.items.length ? result.items[0] : null};
            }));
        } else {
            return of({model: null});
        }

    }

    public getInput(object: Literal) {
        return (object as CreateOrderVariables['input']).map(line => this.orderLineService.getInput(line));
    }

    public getForTransaction(transactionId: string): Observable<Orders['orders']['items'][0]> {

        const qvm = new NaturalQueryVariablesManager<OrdersVariables>();
        const variables: OrdersVariables = {
            filter: {groups: [{conditions: [{transaction: {equal: {value: transactionId}}}]}]},
        };
        qvm.set('variables', variables);
        return this.getAll(qvm).pipe(map(orders => {
            return orders.items[0];
        }));

    }
}
