import {Component, inject, input} from '@angular/core';
import {ProductType} from '../../../../../shared/generated-types';
import {CartLineProduct} from '../../../cart/classes/cart';
import {CartService} from '../../../cart/services/cart.service';
import {RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';

@Component({
    selector: 'app-add-to-cart',
    imports: [MatButton, RouterLink],
    templateUrl: './add-to-cart.component.html',
    styleUrl: './add-to-cart.component.scss',
})
export class AddToCartComponent {
    private readonly cartService = inject(CartService);

    /**
     * Button label
     */
    public readonly label = input.required<string>();

    /**
     * Button background color
     */
    public readonly buttonColor = input<'primary' | 'accent' | 'warn' | null>('primary');

    /**
     * Product to add to cart
     */
    public readonly product = input.required<CartLineProduct>();

    /**
     * Type variant to add to cart
     */
    public readonly type = input.required<ProductType>();

    public inCart = false;

    protected click(): void {
        this.cartService.addProduct(this.product(), this.type(), 1);
        setTimeout(() => (this.inCart = true), 300);
    }
}
