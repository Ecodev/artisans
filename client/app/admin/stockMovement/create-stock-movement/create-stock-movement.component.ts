import { Component, Inject } from '@angular/core';
import { Product, StockMovementInput, StockMovementType } from '../../../shared/generated-types';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-create-stock-movement',
    templateUrl: './create-stock-movement.component.html',
    styleUrls: ['./create-stock-movement.component.scss'],
})
export class CreateStockMovementComponent {
    public quantity = 0;
    public delta = 0;
    public inventory = StockMovementType.inventory;

    public stockMovement: StockMovementInput = {
        type: StockMovementType.delivery,
        delta: 0 as any, // Use integer for easier integration in form int|null values
        remarks: '',
    };

    constructor(@Inject(MAT_DIALOG_DATA) public data: { product: Product['product'] }) {
        this.quantity = +data.product.quantity;
        this.stockMovement['product'] = data.product.id;
    }

    update() {
        if (this.stockMovement.type === StockMovementType.inventory) {
            this.stockMovement.delta = +this.quantity - +this.data.product.quantity as any;
        } else if (this.stockMovement.type === StockMovementType.delivery) {
            this.stockMovement.delta = this.delta as any;
        } else {
            this.stockMovement.delta = -this.delta as any;
        }
    }
}
