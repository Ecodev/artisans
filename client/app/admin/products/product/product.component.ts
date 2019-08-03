import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAbstractDetail, NaturalAlertService } from '@ecodev/natural';
import {
    CreateImage,
    CreateProduct,
    CreateProductVariables,
    OrderLinesVariables,
    Product,
    ProductVariables,
    UpdateProduct,
    UpdateProductVariables,
} from '../../../shared/generated-types';
import { calculateSuggestedPrice, moneyRoundUp } from '../../../shared/utils';
import { ProductTagService } from '../../productTags/services/productTag.service';
import { ImageService } from '../services/image.service';
import { ProductService } from '../services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { StockMovementService } from '../../stockMovement/services/stockMovement.service';
import { CreateStockMovementComponent } from '../../stockMovement/create-stock-movement/create-stock-movement.component';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
})
export class ProductComponent
    extends NaturalAbstractDetail<Product['product'],
        ProductVariables,
        CreateProduct['createProduct'],
        CreateProductVariables,
        UpdateProduct['updateProduct'],
        UpdateProductVariables,
        any> implements OnInit {

    public availableVatRate = [
        '0.000',
        '0.025',
        '0.077',
    ];

    public availableUnits = [
        '',
        'gr',
        'kg',
    ];

    public availableMargin = [
        '0.00',
        '0.15',
        '0.16',
        '0.17',
        '0.18',
        '0.19',
        '0.20',
        '0.21',
        '0.22',
        '0.23',
        '0.24',
        '0.25',
    ];

    public orderLinesVariables: OrderLinesVariables;
    public sellingPriceTooLow: boolean;

    constructor(alertService: NaturalAlertService,
                productService: ProductService,
                router: Router,
                route: ActivatedRoute,
                public productTagService: ProductTagService,
                public imageService: ImageService,
                private dialog: MatDialog,
                private stockMovementService: StockMovementService,
    ) {
        super('product', productService, alertService, router, route);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.orderLinesVariables = {filter: {groups: [{conditions: [{product: {equal: {value: this.data.model.id}}}]}]}};
        this.checkPrice();
    }

    public newImage(image: CreateImage['createImage']) {

        const imageField = this.form.get('image');
        if (imageField) {
            imageField.setValue(image);
            if (this.data.model.id) {
                this.update();
            }
        }
    }

    public calculateSuggestedPricePerUnit(): number {
        const product: Product['product'] = this.data.model;
        const suggested = calculateSuggestedPrice(product.supplierPrice, product.margin, product.vatRate);

        return moneyRoundUp(suggested);
    }

    public verify() {

        const partialProduct = {id: this.data.model.id, verificationDate: (new Date()).toISOString()};
        this.service.updatePartially(partialProduct).subscribe(product => {
            this.form.patchValue(product);
        });

    }

    public checkPrice() {
        const pricePerUnit = this.form.get('pricePerUnit');
        const supplierPrice = this.form.get('supplierPrice');
        if (pricePerUnit && supplierPrice) {
            this.sellingPriceTooLow = +pricePerUnit.value < +supplierPrice.value;
        }
    }

    createStockMovement(): void {
        const product: Product['product'] = this.data.model;

        const config = {
            data: {
                product: product,
            },
        };
        this.dialog.open(CreateStockMovementComponent, config).afterClosed().subscribe(stockMovement => {
            if (stockMovement) {
                this.stockMovementService.create(stockMovement).subscribe(newStockMovement => {
                    this.data.model.quantity = newStockMovement.product.quantity;
                    this.alertService.info('Stock modifié');
                });
            }
        });

    }
}
