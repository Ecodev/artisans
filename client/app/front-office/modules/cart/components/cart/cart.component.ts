import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAlertService } from '@ecodev/natural';
import { CurrencyManager } from '../../../../../shared/classes/currencyManager';
import { ProductType } from '../../../../../shared/generated-types';
import { Cart, CartLineProduct } from '../../classes/cart';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {

    public mode;

    /**
     * For template usage
     */
    public CartService = CartService;

    /**
     * For template usage
     */
    public CurrencyManager = CurrencyManager;

    /**
     * Eligible cart for Order
     */
    public cart: Cart;

    constructor(public alertService: NaturalAlertService,
                public router: Router,
                private route: ActivatedRoute,
                public cartService: CartService) {

    }

    public ngOnInit(): void {
        if (this.route.snapshot.params['cartId']) {
            const cart = Cart.getById(+this.route.snapshot.params['cartId']);
            if (cart) {
                this.cart = cart;
            }
        } else {
            this.cart = CartService.globalCart;
        }
    }

    public empty() {
        this.alertService
            .confirm('Vider le panier', 'Êtes-vous sûr de vouloir vider le panier ? Cette action est irréversible.', 'Vider le panier')
            .subscribe(confirm => {
                if (confirm) {
                    this.cart.empty();
                }
            });
    }

    public increase(product: CartLineProduct, type: ProductType): void {
        this.cart.addProduct(product, type, 1);
    }

    public decrease(product: CartLineProduct, type: ProductType): void {
        this.cart.removeProduct(product, type, 1);

    }

}
