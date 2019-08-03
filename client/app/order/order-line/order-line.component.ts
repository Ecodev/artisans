import { Component, Inject, OnInit } from '@angular/core';
import { NaturalAbstractDetail, NaturalAlertService } from '@ecodev/natural';
import { ActivatedRoute, Router } from '@angular/router';
import {
    OrderLine,
    OrderLineVariables,
    UpdateOrderLine,
    UpdateOrderLineVariables,
} from '../../shared/generated-types';
import { OrderLineService } from '../services/order-lines.service';
import { ProductService } from '../../admin/products/services/product.service';
import { merge, omit } from 'lodash';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogTriggerProvidedData } from '../../shared/components/modal-trigger/dialog-trigger.component';

@Component({
    selector: 'app-order-line',
    templateUrl: './order-line.component.html',
    styleUrls: ['./order-line.component.scss'],
})
export class OrderLineComponent
    extends NaturalAbstractDetail<OrderLine['orderLine'],
        OrderLineVariables,
        never,
        never,
        UpdateOrderLine['updateOrderLine'],
        UpdateOrderLineVariables,
        never> implements OnInit {

    constructor(alertService: NaturalAlertService,
                private orderLineService: OrderLineService,
                public productService: ProductService,
                router: Router,
                route: ActivatedRoute,
                @Inject(MAT_DIALOG_DATA) private dialogData: DialogTriggerProvidedData,
    ) {
        super('orderLine', orderLineService, alertService, router, route);
    }

    /**
     * Override parent to populate data from dialog data instead of standard route data
     */
    ngOnInit(): void {
        this.dialogData.activatedRoute.data.subscribe(data => {
            const key = 'orderLine';
            this.data = merge({model: this.service.getConsolidatedForClient()}, data[key]);
            this.data = merge(this.data, omit(data, [key]));
            this.initForm();
        });
    }

}
