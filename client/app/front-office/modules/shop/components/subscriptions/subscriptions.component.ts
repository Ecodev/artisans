import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NaturalQueryVariablesManager } from '@ecodev/natural';
import { keyBy } from 'lodash';
import { ProductType, Subscriptions_subscriptions_items } from '../../../../../shared/generated-types';
import { Cart } from '../../../cart/classes/cart';
import { SubscriptionService } from './subscription.service';
import { SESSION_STORAGE, SimpleStorage } from '../../../../../shared/classes/memory-storage';

@Component({
    selector: 'app-subscriptions',
    templateUrl: './subscriptions.component.html',
    styleUrls: ['./subscriptions.component.scss'],
})
export class SubscriptionsComponent implements OnInit {

    public subscriptions: { [key: string]: Subscriptions_subscriptions_items };

    public ProductType = ProductType;

    constructor(
        private subscriptionService: SubscriptionService,
        private router: Router,
        @Inject(SESSION_STORAGE) private readonly sessionStorage: SimpleStorage,
    ) {
    }

    ngOnInit() {
        this.subscriptionService.getAll(new NaturalQueryVariablesManager()).subscribe(res => this.subscriptions = keyBy(res.items, 'id'));
    }

    public order(id: string, type: ProductType, withEmails?: boolean) {

        const subscribeFn = (emails?: string[]) => {
            const cart = new Cart(this.sessionStorage);
            cart.setSubscription(this.subscriptions[id], type, emails);

            console.log('cart', cart);
            this.router.navigateByUrl('/panier/' + cart.id);
        };

        if (!withEmails) {
            subscribeFn();
        } else {
            setTimeout(() => subscribeFn(['asdf@qwer.com', 'qwer@asdf.com']), 2000);
        }
    }

}
