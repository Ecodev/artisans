import { Component, Input, OnInit } from '@angular/core';
import { CartLine, CartService } from '../../../cart/services/cart.service';

@Component({
    selector: 'app-add-to-cart',
    templateUrl: './add-to-cart.component.html',
    styleUrls: ['./add-to-cart.component.scss'],
})
export class AddToCartComponent implements OnInit {

    @Input() label: string;
    @Input() product: CartLine['product'];

    public inCart = false;
    public clicked = false;

    constructor(public cartService: CartService) {
    }

    ngOnInit() {
        if (this.cartService.getLineByProduct(this.product)) {
            this.inCart = true;
        }
    }

    public click() {
        this.cartService.increase(this.product, 1);
        this.clicked = true; // first show particle component
        setTimeout(() => this.inCart = true); // then change it's value to cause animation
    }

}
