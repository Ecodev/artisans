import {NaturalErrorMessagePipe} from '@ecodev/natural';
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
import {MatButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatDivider} from '@angular/material/divider';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
    selector: 'app-order-line',
    imports: [
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        NaturalSelectComponent,
        MatDivider,
        MatFormField,
        MatLabel,
        MatError,
        NaturalErrorMessagePipe,
        MatInput,
        NaturalSelectEnumComponent,
        MatButton,
    ],
    templateUrl: './order-line.component.html',
    styleUrl: './order-line.component.scss',
})
export class OrderLineComponent
    extends NaturalAbstractDetail<OrderLineService, NaturalSeoResolveData>
    implements OnInit
{
    protected readonly productService = inject(ProductService);
    protected readonly subscriptionService = inject(SubscriptionService);

    public constructor() {
        super('orderLine', inject(OrderLineService));
    }
}
