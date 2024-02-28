import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {
    NaturalAbstractDetail,
    NaturalDialogTriggerProvidedData,
    NaturalSelectComponent,
    NaturalSelectEnumComponent,
    NaturalSeoResolveData,
} from '@ecodev/natural';
import {merge, omit} from 'lodash-es';
import {ProductService} from '../../products/services/product.service';
import {OrderLineService} from '../services/order-lines.service';
import {SubscriptionService} from '../../../front-office/modules/shop/components/subscriptions/subscription.service';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FlexModule} from '@ngbracket/ngx-layout/flex';
import {MatDividerModule} from '@angular/material/divider';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
    selector: 'app-order-line',
    templateUrl: './order-line.component.html',
    styleUrls: ['./order-line.component.scss'],
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
    public constructor(
        private readonly orderLineService: OrderLineService,
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
        this.dialogData.activatedRoute.data.subscribe(data => {
            const key = 'orderLine';
            this.data = merge({model: this.service.getDefaultForServer()}, data[key]);
            this.data = merge(this.data, omit(data, [key]));
            this.initForm();
        });
    }
}
