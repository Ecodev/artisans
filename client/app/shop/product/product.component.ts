import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProductService } from '../../admin/products/services/product.service';
import { DialogTriggerProvidedData } from '../../shared/components/modal-trigger/dialog-trigger.component';
import { CartService } from '../services/cart.service';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {

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

    constructor(@Inject(MAT_DIALOG_DATA) data: DialogTriggerProvidedData,
                private cartService: CartService,
                productService: ProductService,
                private router: Router) {

        this.routeSnapshot = data.activatedRoute.snapshot;
        this.data = {model: this.routeSnapshot.data.news.model}; // to respect our template standard

        if (this.data.model) {
            if (this.routeSnapshot.params.index) {
                this.edit = true;
                this.quantityForm.setValue(this.cartService.cart[+this.routeSnapshot.params.index].quantity);
            }

            this.computePrice();
            this.quantityForm.valueChanges.subscribe(() => this.computePrice(true));

            // Fetch permissions if they are missing
            if (!this.data.model.permissions) {
                productService.getOne(this.data.model.id).subscribe(productWithPermissions => this.data.model = productWithPermissions);
            }
        }

    }

    ngOnInit() {
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

    public addToCart(): void {
        this.cartService.add(this.data.model, +this.quantityForm.value);
        this.router.navigateByUrl('/');
    }

    public updateCart(): void {
        this.cartService.updateProduct(+this.routeSnapshot.params.index, +this.quantityForm.value);
        this.router.navigateByUrl('/');
    }

    public removeFromCart(): void {
        this.cartService.remove(+this.routeSnapshot.params.index);
        this.router.navigateByUrl('/');
    }

    public increase(): void {
        this.quantityForm.setValue(+this.quantityForm.value + 1);
        this.quantityForm.markAsDirty();
    }

    public decrease(): void {
        const value = +this.quantityForm.value - 1;
        this.quantityForm.setValue(value < 0 ? 0 : value);
        this.quantityForm.markAsDirty();

    }

    public updateOrAddToCart(): void {
        if (this.formGroup.invalid || !this.data.model.isActive) {
            return;
        }

        if (this.data && this.data.model) {
            if (this.edit) {
                this.updateCart();
            } else {
                this.addToCart();
            }
        }
    }
}
