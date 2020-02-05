import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import {
    FormAsyncValidators,
    FormValidators,
    NaturalAbstractModelService,
    NaturalQueryVariablesManager,
    unique,
} from '@ecodev/natural';
import { Apollo } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    CreateSubscription,
    CreateSubscriptionVariables,
    DeleteSubscriptions,
    ProductType,
    Subscription, Subscription_subscription,
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
export class SubscriptionService extends NaturalAbstractModelService<Subscription['subscription'],
    SubscriptionVariables,
    Subscriptions['subscriptions'],
    SubscriptionsVariables,
    CreateSubscription['createSubscription'],
    CreateSubscriptionVariables,
    UpdateSubscription['updateSubscription'],
    UpdateSubscriptionVariables,
    DeleteSubscriptions> {

    constructor(apollo: Apollo) {
        super(apollo,
            'subscription',
            subscriptionQuery,
            subscriptionsQuery,
            createSubscription,
            updateSubscription,
            deleteSubscriptions);
    }

    public getFormValidators(): FormValidators {
        return {
            code: [Validators.maxLength(20)],
            name: [Validators.required, Validators.maxLength(100)],
            minimumQuantity: [Validators.required, Validators.min(0)],
        };
    }

    public getFormAsyncValidators(model: Subscription_subscription): FormAsyncValidators {
        return {
            code: [unique('code', model.id, this)],
        };
    }

    public resolveByCode(code: string): Observable<{ model: any }> {

        if (code) {
            const qvm = new NaturalQueryVariablesManager<SubscriptionsVariables>();
            const variables: SubscriptionsVariables = {
                filter: {groups: [{conditions: [{code: {equal: {value: code}}}]}]},
            };
            qvm.set('variables', variables);

            return this.getAll(qvm).pipe(map(result => {
                return {model: result && result.items.length ? result.items[0] : null};
            }));
        } else {
            return of({model: null});
        }

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
