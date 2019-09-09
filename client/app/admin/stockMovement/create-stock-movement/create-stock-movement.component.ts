import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product, StockMovementInput, StockMovementType } from '../../../shared/generated-types';
import { ProductService } from '../../products/services/product.service';
import { StockMovementService } from '../services/stockMovement.service';

@Component({
    selector: 'app-create-stock-movement',
    templateUrl: './create-stock-movement.component.html',
    styleUrls: ['./create-stock-movement.component.scss'],
})
export class CreateStockMovementComponent {

    private lockedButtons = false;

    public quantity = 0;
    public delta = 0;
    public inventory = StockMovementType.inventory;

    public stockMovement: StockMovementInput = {
        type: StockMovementType.delivery,
        delta: 0 as any, // Use integer for easier integration in form int|null values
        remarks: '',
    };

    constructor(@Inject(MAT_DIALOG_DATA) public data: { product: Product['product'] },
                private dialogRef: MatDialogRef<CreateStockMovementComponent>,
                private productService: ProductService,
                private stockMovementService: StockMovementService) {
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

    public verify() {
        this.productService.verify(this.data.product);
    }

    public create(stockMovement) {
        this.lockedButtons = true;
        this.stockMovementService.create(stockMovement).subscribe(newStockMovement => {
            this.lockedButtons = false;
            this.dialogRef.close(newStockMovement);
        });
    }
}
