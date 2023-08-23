import {Apollo} from 'apollo-angular';
import {Injectable} from '@angular/core';
import {ValidatorFn, Validators} from '@angular/forms';
import {FormValidators, integer, NaturalAbstractModelService, NaturalDebounceService} from '@ecodev/natural';
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
    UpdateOrderLineVariables,
    UpdateOrderLine['updateOrderLine'],
    UpdateOrderLineVariables,
    never,
    never
> {
    public constructor(apollo: Apollo, naturalDebounceService: NaturalDebounceService) {
        super(
            apollo,
            naturalDebounceService,
            'orderLine',
            orderLineQuery,
            orderLinesQuery,
            null,
            updateOrderLine,
            null,
        );
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
            type: ProductType.digital,
            additionalEmails: [],
        };
    }
}
