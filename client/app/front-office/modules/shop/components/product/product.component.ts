import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NaturalAbstractDetail } from '@ecodev/natural';
import { ProductService } from '../../../../../admin/products/services/product.service';
import {
    CreateProduct,
    CreateProductVariables,
    OrderLinesVariables,
    Product,
    ProductVariables,
    UpdateProduct,
    UpdateProductVariables,
} from '../../../../../shared/generated-types';
import { CartService } from '../../../cart/services/cart.service';

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

    public orderLinesVariables: OrderLinesVariables;

    constructor(private productService: ProductService,
                injector: Injector,
                private cartService: CartService,
    ) {
        super('product', productService, injector);
    }

    /**
     * Stores cart service to allow access from template
     */
    public CartService = CartService;

    /**
     * Resolved model product. Called data to stay compliant with usual providing naming and usage in template
     */
    public data: any;

    /**
     * True if we are in edition mode after selecting an existing cart line from cart list. Activates some special layout for line update
     */
    public edit = false;

    /**
     * Formatted displayed price
     */
    public price = 0;

    /**
     * Stores DialogTriggerComponent actuvated route snapshot
     */
    private routeSnapshot;

    /**
     * Form controller for quantity
     */
    public quantityForm = new FormControl(null, [Validators.required, Validators.min(0)]);

    /**
     * Combination of form controls of the page
     */
    public formGroup = new FormGroup({quantity: this.quantityForm});

    ngOnInit(): void {
        super.ngOnInit();
    }

    public computePrice(skipFormat = false): void {

        // Assume no quantity cost nothing for the sake of simple display for end-users
        if (this.quantityForm.value === null) {
            this.price = 0;
            return;
        }

        if (!skipFormat) {
            const qty = +this.quantityForm.value;
            if (!this.data.model.unit && Math.floor(qty) !== qty) {
                this.quantityForm.setValue(Math.round(qty));
            }
        }

        this.price = CartService.getPriceTaxInc(this.data.model, this.quantityForm.value);
    }

}
