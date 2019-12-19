import { Component, Input, OnInit } from '@angular/core';
import { ProductType } from '../../../../../shared/generated-types';
import { CartLine, CartService } from '../../../cart/services/cart.service';

@Component({
    selector: 'app-add-to-cart',
    templateUrl: './add-to-cart.component.html',
    styleUrls: ['./add-to-cart.component.scss'],
})
export class AddToCartComponent implements OnInit {

    /**
     * Button label
     */
    @Input() label: string;

    /**
     * Product to add to cart
     */
    @Input() product: CartLine['product'];

    /**
     * Type variant to add to cart
     */
    @Input() type: ProductType;

    public inCart = false;
    public clicked = false;

    constructor(public cartService: CartService) {
    }

    ngOnInit() {
    }

    public click() {
        this.cartService.increase(this.product, this.type, 1);
        this.clicked = true; // first show particle component
        setTimeout(() => this.inCart = true); // then change it's value to cause animation
    }

}
