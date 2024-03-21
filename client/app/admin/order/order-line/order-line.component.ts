import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {
    NaturalAbstractDetail,
    NaturalDialogTriggerProvidedData,
    NaturalSelectComponent,
    NaturalSelectEnumComponent,
    NaturalSeoResolveData,
    ResolvedData,
} from '@ecodev/natural';
import {ProductService} from '../../products/services/product.service';
import {OrderLineService} from '../services/order-lines.service';
import {SubscriptionService} from '../../../front-office/modules/shop/components/subscriptions/subscription.service';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FlexModule} from '@ngbracket/ngx-layout/flex';
import {MatDividerModule} from '@angular/material/divider';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable, Subscription, takeUntil} from 'rxjs';
import {orderLineResolvers} from '../services/order-line.resolver';

@Component({
    selector: 'app-order-line',
    templateUrl: './order-line.component.html',
    styleUrl: './order-line.component.scss',
    standalone: true,
    imports: [
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        NaturalSelectComponent,
        MatDividerModule,
        FlexModule,
        MatFormFieldModule,
        MatInputModule,
        NaturalSelectEnumComponent,
        MatButtonModule,
    ],
})
export class OrderLineComponent
    extends NaturalAbstractDetail<OrderLineService, NaturalSeoResolveData>
    implements OnInit
{
    #modelSub: Subscription | null = null;

    public constructor(
        orderLineService: OrderLineService,
        public readonly productService: ProductService,
        public readonly subscriptionService: SubscriptionService,
        @Inject(MAT_DIALOG_DATA) private readonly dialogData: NaturalDialogTriggerProvidedData<never>,
    ) {
        super('orderLine', orderLineService);
    }

    /**
     * Override parent to populate data from dialog data instead of standard route data
     */
    public override ngOnInit(): void {
        this.dialogData.activatedRoute.data.subscribe(incomingData => {
            if (!(incomingData.model instanceof Observable)) {
                throw new Error(
                    'Resolved data must include the key `model`, and it must be an observable (usually one from Apollo).',
                );
            }

            // Subscribe to model to know when Apollo cache is changed, so we can reflect it into `data.model`
            this.#modelSub?.unsubscribe();
            this.#modelSub = (incomingData.model as ResolvedData<typeof orderLineResolvers>['model'])
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe(model => {
                    this.data = {
                        ...(incomingData as NaturalSeoResolveData),
                        model: model,
                    };
                });

            this.initForm();
        });
    }
}
