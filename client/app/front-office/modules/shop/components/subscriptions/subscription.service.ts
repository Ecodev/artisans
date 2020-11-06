import {Apollo} from 'apollo-angular';
import {Injectable} from '@angular/core';
import {Validators} from '@angular/forms';
import {FormAsyncValidators, FormValidators, NaturalAbstractModelService, unique} from '@ecodev/natural';
import {
    CreateSubscription,
    CreateSubscriptionVariables,
    DeleteSubscriptions,
    DeleteSubscriptionsVariables,
    ProductType,
    Subscription,
    Subscription_subscription,
    SubscriptionInput,
    Subscriptions,
    SubscriptionsVariables,
    SubscriptionVariables,
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
    Subscription['subscription'],
    SubscriptionVariables,
    Subscriptions['subscriptions'],
    SubscriptionsVariables,
    CreateSubscription['createSubscription'],
    CreateSubscriptionVariables,
    UpdateSubscription['updateSubscription'],
    UpdateSubscriptionVariables,
    DeleteSubscriptions,
    DeleteSubscriptionsVariables
> {
    constructor(apollo: Apollo) {
        super(
            apollo,
            'subscription',
            subscriptionQuery,
            subscriptionsQuery,
            createSubscription,
            updateSubscription,
            deleteSubscriptions,
        );
    }

    public getFormValidators(): FormValidators {
        return {
            code: [Validators.maxLength(25)],
            name: [Validators.required, Validators.maxLength(100)],
            minimumQuantity: [Validators.required, Validators.min(0)],
        };
    }

    public getFormAsyncValidators(model: Subscription_subscription): FormAsyncValidators {
        return {
            code: [unique('code', model.id, this)],
        };
    }

    protected getDefaultForServer(): SubscriptionInput {
        return {
            name: '',
            code: null,
            description: '',
            pricePerUnitCHF: '0',
            pricePerUnitEUR: '0',
            internalRemarks: '',
            isActive: true,
            image: null,
            type: ProductType.digital,
        };
    }
}
