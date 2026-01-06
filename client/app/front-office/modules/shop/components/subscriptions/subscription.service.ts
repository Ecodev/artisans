import {Injectable} from '@angular/core';
import {Validators} from '@angular/forms';
import {FormAsyncValidators, FormValidators, NaturalAbstractModelService, unique} from '@ecodev/natural';
import {
    CreateSubscription,
    CreateSubscriptionVariables,
    DeleteSubscriptions,
    DeleteSubscriptionsVariables,
    ProductType,
    SubscriptionInput,
    SubscriptionQuery,
    SubscriptionQueryVariables,
    SubscriptionsQuery,
    SubscriptionsQueryVariables,
    UpdateSubscription,
    UpdateSubscriptionVariables,
} from '../../../../../shared/generated-types';
import {
    createSubscription,
    deleteSubscriptions,
    subscriptionQuery,
    subscriptionsQuery,
    updateSubscription,
} from './subscription.queries';

@Injectable({
    providedIn: 'root',
})
export class SubscriptionService extends NaturalAbstractModelService<
    SubscriptionQuery['subscription'],
    SubscriptionQueryVariables,
    SubscriptionsQuery['subscriptions'],
    SubscriptionsQueryVariables,
    CreateSubscription['createSubscription'],
    CreateSubscriptionVariables,
    UpdateSubscription['updateSubscription'],
    UpdateSubscriptionVariables,
    DeleteSubscriptions,
    DeleteSubscriptionsVariables
> {
    public constructor() {
        super(
            'subscription',
            subscriptionQuery,
            subscriptionsQuery,
            createSubscription,
            updateSubscription,
            deleteSubscriptions,
        );
    }

    public override getFormValidators(): FormValidators {
        return {
            code: [Validators.maxLength(25)],
            name: [Validators.required, Validators.maxLength(100)],
            minimumQuantity: [Validators.required, Validators.min(0)],
        };
    }

    public override getFormAsyncValidators(model: SubscriptionQuery['subscription']): FormAsyncValidators {
        return {
            code: [unique('code', model.id, this)],
        };
    }

    public override getDefaultForServer(): SubscriptionInput {
        return {
            name: '',
            code: null,
            description: '',
            pricePerUnitCHF: '0',
            pricePerUnitEUR: '0',
            internalRemarks: '',
            isActive: true,
            image: null,
            type: ProductType.Digital,
        };
    }
}
