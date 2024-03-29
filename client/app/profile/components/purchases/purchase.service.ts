import {Apollo} from 'apollo-angular';
import {Injectable} from '@angular/core';
import {NaturalAbstractModelService, NaturalDebounceService} from '@ecodev/natural';
import {Purchases, PurchasesVariables} from '../../../shared/generated-types';
import {purchasesQuery} from './purchase.queries';

/**
 * A special service that accept Product variables but return OrderLine that were
 * purchased by current user.
 */
@Injectable({
    providedIn: 'root',
})
export class PurchaseService extends NaturalAbstractModelService<
    never,
    never,
    Purchases['purchases'],
    PurchasesVariables,
    never,
    never,
    never,
    never,
    never,
    never
> {
    public constructor(apollo: Apollo, naturalDebounceService: NaturalDebounceService) {
        super(apollo, naturalDebounceService, 'purchase', null, purchasesQuery, null, null, null);
    }
}
