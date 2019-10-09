import { Injectable } from '@angular/core';
import { FormValidators, NaturalAbstractModelService } from '@ecodev/natural';
import { Apollo } from 'apollo-angular';
import {
    OrderLine,
    OrderLineInput,
    OrderLines,
    OrderLinesVariables,
    OrderLineVariables,
    OrderType,
    UpdateOrderLine,
    UpdateOrderLineVariables,
} from '../../shared/generated-types';
import { orderLineQuery, orderLinesQuery, updateOrderLine } from './order-lines.queries';
import { Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class OrderLineService extends NaturalAbstractModelService<OrderLine['orderLine'],
    OrderLineVariables,
    OrderLines['orderLines'],
    OrderLinesVariables,
    never,
    never,
    UpdateOrderLine['updateOrderLine'],
    UpdateOrderLineVariables,
    never> {

    constructor(apollo: Apollo) {
        super(apollo,
            'orderLine',
            orderLineQuery,
            orderLinesQuery,
            null,
            updateOrderLine,
            null);
    }

    protected getDefaultForServer(): OrderLineInput {
        return {
            product: null,
            quantity: '0',
            isCHF: true,
            type: OrderType.digital,
        };
    }

    public getFormValidators(): FormValidators {
        return {
            product: [Validators.required],
            quantity: [Validators.required],
        };
    }
}
