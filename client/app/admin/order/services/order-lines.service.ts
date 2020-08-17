import {Injectable} from '@angular/core';
import {ValidatorFn, Validators} from '@angular/forms';
import {FormValidators, integer, Literal, NaturalAbstractModelService} from '@ecodev/natural';
import {Apollo} from 'apollo-angular';
import {
    OrderLine,
    OrderLineInput,
    OrderLines,
    OrderLinesVariables,
    OrderLineVariables,
    ProductType,
    UpdateOrderLine,
    UpdateOrderLineVariables,
} from '../../../shared/generated-types';
import {orderLineQuery, orderLinesQuery, updateOrderLine} from './order-lines.queries';
import {xorValidator} from '../../../shared/validators';

@Injectable({
    providedIn: 'root',
})
export class OrderLineService extends NaturalAbstractModelService<
    OrderLine['orderLine'],
    OrderLineVariables,
    OrderLines['orderLines'],
    OrderLinesVariables,
    never,
    never,
    UpdateOrderLine['updateOrderLine'],
    UpdateOrderLineVariables,
    never,
    never
> {
    constructor(apollo: Apollo) {
        super(apollo, 'orderLine', orderLineQuery, orderLinesQuery, null, updateOrderLine, null);
    }

    public getFormGroupValidators(model?: Literal): ValidatorFn[] {
        return [xorValidator('productXorSubscription', ['product', 'subscription'])];
    }

    public getFormValidators(): FormValidators {
        return {
            quantity: [Validators.required, integer],
        };
    }

    protected getDefaultForServer(): OrderLineInput {
        return {
            product: null,
            subscription: null,
            pricePerUnit: null,
            quantity: 0,
            isCHF: true,
            type: ProductType.digital,
            additionalEmails: [],
        };
    }
}
