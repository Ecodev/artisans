import {inject, Injectable} from '@angular/core';
import {type Literal, NaturalAbstractModelService} from '@ecodev/natural';
import {type Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {
    type CreateOrder,
    type CreateOrderVariables,
    type OrderInput,
    type OrderQuery,
    type OrderQueryVariables,
    type OrdersQuery,
    type OrdersQueryVariables,
    type OrderStatus,
    type UpdateOrderStatus,
    type UpdateOrderStatusVariables,
} from '../../../shared/generated-types';
import {OrderLineService} from './order-lines.service';
import {createOrder, orderQuery, ordersQuery, updateOrderStatus} from './order.queries';

@Injectable({
    providedIn: 'root',
})
export class OrderService extends NaturalAbstractModelService<
    OrderQuery['order'],
    OrderQueryVariables,
    OrdersQuery['orders'],
    OrdersQueryVariables,
    CreateOrder['createOrder'],
    CreateOrderVariables,
    never,
    never,
    never,
    never
> {
    private readonly orderLineService = inject(OrderLineService);

    public constructor() {
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
                    this.apollo.client.refetchObservableQueries();

                    return;
                }),
            );
    }
}
