import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from '@angular/router';
import {
    NaturalAlertService,
    NaturalBackgroundDensityDirective,
    NaturalEnumPipe,
    NaturalIconDirective,
} from '@ecodev/natural';
import {CurrencyService} from '../../../../../shared/services/currency.service';
import {ProductType} from '../../../../../shared/generated-types';
import {Cart, CartLineProduct} from '../../classes/cart';
import {CartService} from '../../services/cart.service';
import {GlobalCartService} from '../../services/global-cart.service';
import {CartCollectionService} from '../../services/cart-collection.service';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {PriceComponent} from '../../../../../shared/components/price/price.component';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.scss',
    imports: [
        CommonModule,
        MatButtonModule,
        RouterLink,
        PriceComponent,
        MatIconModule,
        NaturalIconDirective,
        MatDividerModule,
        RouterOutlet,
        NaturalEnumPipe,
        NaturalBackgroundDensityDirective,
    ],
})
export class CartComponent implements OnInit {
    private readonly alertService = inject(NaturalAlertService);
    public readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    public readonly cartService = inject(CartService);
    public readonly currencyService = inject(CurrencyService);
    private readonly globalCartService = inject(GlobalCartService);
    private readonly cartCollectionService = inject(CartCollectionService);

    /**
     * Eligible cart for Order
     */
    public cart?: Cart;

    public ngOnInit(): void {
        if (this.route.snapshot.params.cartId) {
            const cart = this.cartCollectionService.getById(+this.route.snapshot.params.cartId);
            if (cart) {
                this.cart = cart;
            }
        } else {
            this.cart = this.globalCartService.cart;
        }
    }

    public empty(): void {
        this.alertService
            .confirm(
                'Vider le panier',
                'Êtes-vous sûr de vouloir vider le panier ? Cette action est irréversible.',
                'Vider le panier',
            )
            .subscribe(confirm => {
                if (confirm) {
                    this.cart?.empty();
                }
            });
    }

    public increase(product: CartLineProduct, type: ProductType): void {
        this.cart?.addProduct(product, type, 1);
    }

    public decrease(product: CartLineProduct, type: ProductType): void {
        this.cart?.removeProduct(product, type, 1);
    }
}
