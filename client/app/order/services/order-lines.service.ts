import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormValidators, NaturalAbstractModelService } from '@ecodev/natural';
import { Apollo } from 'apollo-angular';
import {
    OrderLine,
    OrderLineInput,
    OrderLines,
    OrderLinesVariables,
    OrderLineVariables,
    ProductType,
    UpdateOrderLine,
    UpdateOrderLineVariables,
} from '../../shared/generated-types';
import { orderLineQuery, orderLinesQuery, updateOrderLine } from './order-lines.queries';

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
            type: ProductType.digital,
        };
    }

    public getFormValidators(): FormValidators {
        return {
            product: [Validators.required],
            quantity: [Validators.required],
        };
    }
}
