import {Component, Input, OnInit} from '@angular/core';
import {ProductType} from '../../../../../shared/generated-types';
import {CartLineProduct} from '../../../cart/classes/cart';
import {CartService} from '../../../cart/services/cart.service';

@Component({
    selector: 'app-add-to-cart',
    templateUrl: './add-to-cart.component.html',
    styleUrls: ['./add-to-cart.component.scss'],
})
export class AddToCartComponent {
    /**
     * Button label
     */
    @Input() public label!: string;

    /**
     * Button background color
     */
    @Input() public buttonColor: 'primary' | 'accent' | 'warn' | null = 'primary';

    /**
     * Product to add to cart
     */
    @Input() public product!: CartLineProduct;

    /**
     * Type variant to add to cart
     */
    @Input() public type!: ProductType;

    public inCart = false;

    public constructor(private readonly cartService: CartService) {}

    public click(): void {
        this.cartService.addProduct(this.product, this.type, 1);
        setTimeout(() => (this.inCart = true), 300);
    }
}
