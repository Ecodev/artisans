import {Injectable} from '@angular/core';
import {type ValidatorFn, Validators} from '@angular/forms';
import {type FormValidators, integer, NaturalAbstractModelService} from '@ecodev/natural';
import {
    type OrderLineInput,
    type OrderLineQuery,
    type OrderLineQueryVariables,
    type OrderLinesQuery,
    type OrderLinesQueryVariables,
    ProductType,
    type UpdateOrderLine,
    type UpdateOrderLineVariables,
} from '../../../shared/generated-types';
import {orderLineQuery, orderLinesQuery, updateOrderLine} from './order-lines.queries';
import {xorValidator} from '../../../shared/validators';

@Injectable({
    providedIn: 'root',
})
export class OrderLineService extends NaturalAbstractModelService<
    OrderLineQuery['orderLine'],
    OrderLineQueryVariables,
    OrderLinesQuery['orderLines'],
    OrderLinesQueryVariables,
    never,
    UpdateOrderLineVariables,
    UpdateOrderLine['updateOrderLine'],
    UpdateOrderLineVariables,
    never,
    never
> {
    public constructor() {
        super('orderLine', orderLineQuery, orderLinesQuery, null, updateOrderLine, null);
    }

    public override getFormGroupValidators(): ValidatorFn[] {
        return [xorValidator('productXorSubscription', ['product', 'subscription'])];
    }

    public override getFormValidators(): FormValidators {
        return {
            quantity: [Validators.required, integer],
        };
    }

    public override getDefaultForServer(): OrderLineInput {
        return {
            product: null,
            subscription: null,
            pricePerUnit: null,
            quantity: 0,
            isCHF: true,
            type: ProductType.Digital,
            additionalEmails: [],
        };
    }
}
