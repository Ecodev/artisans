import {Component, inject, Input} from '@angular/core';
import {ProductType} from '../../../../../shared/generated-types';
import {CartLineProduct} from '../../../cart/classes/cart';
import {CartService} from '../../../cart/services/cart.service';
import {RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';

@Component({
    selector: 'app-add-to-cart',
    templateUrl: './add-to-cart.component.html',
    styleUrl: './add-to-cart.component.scss',
    imports: [MatButtonModule, RouterLink],
})
export class AddToCartComponent {
    private readonly cartService = inject(CartService);

    /**
     * Button label
     */
    @Input({required: true}) public label!: string;

    /**
     * Button background color
     */
    @Input() public buttonColor: 'primary' | 'accent' | 'warn' | null = 'primary';

    /**
     * Product to add to cart
     */
    @Input({required: true}) public product!: CartLineProduct;

    /**
     * Type variant to add to cart
     */
    @Input({required: true}) public type!: ProductType;

    public inCart = false;

    public click(): void {
        this.cartService.addProduct(this.product, this.type, 1);
        setTimeout(() => (this.inCart = true), 300);
    }
}
