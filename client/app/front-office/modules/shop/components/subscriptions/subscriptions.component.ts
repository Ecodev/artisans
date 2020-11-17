import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {NaturalQueryVariablesManager, NaturalStorage, SESSION_STORAGE} from '@ecodev/natural';
import {keyBy} from 'lodash-es';
import {ProductType, Subscriptions_subscriptions_items} from '../../../../../shared/generated-types';
import {EmailsComponent} from '../emails/emails.component';
import {SubscriptionService} from './subscription.service';
import {GlobalCartService} from '../../../cart/services/global-cart.service';

@Component({
    selector: 'app-subscriptions',
    templateUrl: './subscriptions.component.html',
    styleUrls: ['./subscriptions.component.scss'],
})
export class SubscriptionsComponent implements OnInit {
    public subscriptions: {[key: string]: Subscriptions_subscriptions_items} = {};

    public ProductType = ProductType;

    constructor(
        private subscriptionService: SubscriptionService,
        private router: Router,
        @Inject(SESSION_STORAGE) private readonly sessionStorage: NaturalStorage,
        public dialog: MatDialog,
        private route: ActivatedRoute,
        private readonly globalCartService: GlobalCartService,
    ) {}

    public ngOnInit(): void {
        this.subscriptionService
            .getAll(new NaturalQueryVariablesManager())
            .subscribe(res => (this.subscriptions = keyBy(res.items, 'id')));
    }

    public order(id: string, type: ProductType, withEmails?: boolean): void {
        const subscribeFn = (emails?: string[]) => {
            const cart = this.globalCartService.cart;
            cart.setSubscription(this.subscriptions[id], type, emails);
            this.router.navigateByUrl('/panier/' + cart.id);
        };

        if (!withEmails) {
            subscribeFn();
        } else {
            const viewer = this.route.snapshot.data.viewer;

            const dialogData: MatDialogConfig = {
                data: {
                    emails: [viewer ? viewer.model.email : '', '', ''], // prefill with user email if logged in
                    title: "Emails des bénéficiaires de l'abonnement profesionnel",
                },
            };

            this.dialog
                .open(EmailsComponent, dialogData)
                .afterClosed()
                .subscribe(result => {
                    if (result) {
                        subscribeFn(result);
                    }
                });
        }
    }
}
