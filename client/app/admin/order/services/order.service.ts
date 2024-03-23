import {Injectable} from '@angular/core';
import {Literal, NaturalAbstractModelService} from '@ecodev/natural';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {
    CreateOrder,
    CreateOrderVariables,
    Order,
    OrderInput,
    Orders,
    OrderStatus,
    OrdersVariables,
    OrderVariables,
    UpdateOrderStatus,
    UpdateOrderStatusVariables,
} from '../../../shared/generated-types';
import {OrderLineService} from './order-lines.service';
import {createOrder, orderQuery, ordersQuery, updateOrderStatus} from './order.queries';

@Injectable({
    providedIn: 'root',
})
export class OrderService extends NaturalAbstractModelService<
    Order['order'],
    OrderVariables,
    Orders['orders'],
    OrdersVariables,
    CreateOrder['createOrder'],
    CreateOrderVariables,
    never,
    never,
    never,
    never
> {
    public constructor(private readonly orderLineService: OrderLineService) {
        super('order', orderQuery, ordersQuery, createOrder, null, null);
    }

    public override getInput(object: Literal, forCreation: boolean): OrderInput {
        const orderLinesInput = object.orderLines.map((line: Literal) =>
            this.orderLineService.getInput(line, forCreation),
        );
        object.orderLines = orderLinesInput;

        return object as OrderInput;
    }

    public changeStatus(id: string, status: OrderStatus): Observable<void> {
        return this.apollo
            .mutate<UpdateOrderStatus, UpdateOrderStatusVariables>({
                mutation: updateOrderStatus,
                variables: {id, status},
            })
            .pipe(
                map(() => {
                    this.apollo.client.reFetchObservableQueries();

                    return;
                }),
            );
    }
}
