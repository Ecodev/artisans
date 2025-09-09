import {Component, inject, OnInit} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {
    NaturalAbstractDetail,
    NaturalSelectComponent,
    NaturalSelectEnumComponent,
    NaturalSeoResolveData,
} from '@ecodev/natural';
import {ProductService} from '../../products/services/product.service';
import {OrderLineService} from '../services/order-lines.service';
import {SubscriptionService} from '../../../front-office/modules/shop/components/subscriptions/subscription.service';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDividerModule} from '@angular/material/divider';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
    selector: 'app-order-line',
    imports: [
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        NaturalSelectComponent,
        MatDividerModule,
        MatFormFieldModule,
        MatInputModule,
        NaturalSelectEnumComponent,
        MatButtonModule,
    ],
    templateUrl: './order-line.component.html',
    styleUrl: './order-line.component.scss',
})
export class OrderLineComponent
    extends NaturalAbstractDetail<OrderLineService, NaturalSeoResolveData>
    implements OnInit
{
    public readonly productService = inject(ProductService);
    public readonly subscriptionService = inject(SubscriptionService);

    public constructor() {
        super('orderLine', inject(OrderLineService));
    }
}
