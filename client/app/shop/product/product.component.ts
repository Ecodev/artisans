import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {

    public CartService = CartService;
    public data: any;
    public quantityForm = new FormControl(1, [Validators.required]);
    public edit = false;
    public price;
    private routeSnapshot;

    constructor(@Inject(MAT_DIALOG_DATA) data: any,
                private cartService: CartService,
                private router: Router) {

        this.routeSnapshot = data.routeSnapshot;
        this.data = {model: this.routeSnapshot.data.product.model}; // to respect our template standard

        if (this.data.model) {
            if (this.routeSnapshot.params.quantity) {
                this.edit = true;
                this.quantityForm.setValue(this.routeSnapshot.params.quantity);
            }

            this.price = CartService.getPriceTaxInc(this.data.model, Number(this.quantityForm.value));
            this.quantityForm.valueChanges.subscribe(val => {
                this.price = CartService.getPriceTaxInc(this.data.model, Number(val));
            });
        }

    }

    ngOnInit() {

    }

    public addToCart() {
        this.cartService.add(this.data.model, this.quantityForm.value);
        this.router.navigateByUrl('/');
    }

    public updateCart() {
        this.cartService.setQuantity(this.data.model, Number(this.quantityForm.value));
        this.router.navigateByUrl('/');
    }

    public removeFromCart() {
        this.cartService.remove(this.data.model);
        this.router.navigateByUrl('/');
    }

    public increase() {
        this.quantityForm.setValue(Number(this.quantityForm.value) + 1);
    }

    public decrease() {
        const value = Number(this.quantityForm.value) - 1;
        this.quantityForm.setValue(value < 0 ? 0 : value);
    }

}
