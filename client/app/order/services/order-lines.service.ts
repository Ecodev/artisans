import { Injectable } from '@angular/core';
import { NaturalAbstractModelService } from '@ecodev/natural';
import { Apollo } from 'apollo-angular';
import { OrderLineInput, OrderLines, OrderLinesVariables } from '../../shared/generated-types';
import { orderLinesQuery } from './order-lines.queries';

@Injectable({
    providedIn: 'root',
})
export class OrderLineService extends NaturalAbstractModelService<null,
    null,
    OrderLines['orderLines'],
    OrderLinesVariables,
    null,
    any,
    any,
    any,
    any> {

    constructor(apollo: Apollo) {
        super(apollo,
            'orderLine',
            null,
            orderLinesQuery,
            null,
            null,
            null);
    }

    protected getDefaultForServer(): OrderLineInput {
        return {
            product: null,
            quantity: '0',
            pricePonderation: '1',
        };
    }

}
