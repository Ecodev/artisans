import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NaturalQueryVariablesManager } from '@ecodev/natural';
import { keyBy } from 'lodash';
import { ProductType, Subscriptions_subscriptions_items } from '../../../../../shared/generated-types';
import { Cart } from '../../../cart/classes/cart';
import { SubscriptionService } from './subscription.service';

@Component({
    selector: 'app-subscriptions',
    templateUrl: './subscriptions.component.html',
    styleUrls: ['./subscriptions.component.scss'],
})
export class SubscriptionsComponent implements OnInit {

    public subscriptions: { [key: string]: Subscriptions_subscriptions_items };

    public ProductType = ProductType;

    constructor(private subscriptionService: SubscriptionService, private router: Router) {
    }

    ngOnInit() {
        this.subscriptionService.getAll(new NaturalQueryVariablesManager()).subscribe(res => this.subscriptions = keyBy(res.items, 'id'));
    }

    public subscribe(id: string, type: ProductType) {
        const cart = new Cart();
        cart.increase(this.subscriptions[id], type);
        this.router.navigateByUrl('/panier/' + cart.id);
    }

}
