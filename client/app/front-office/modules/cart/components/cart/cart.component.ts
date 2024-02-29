import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from '@angular/router';
import {NaturalAlertService, NaturalIconDirective, NaturalEnumPipe} from '@ecodev/natural';
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
import {FlexModule} from '@ngbracket/ngx-layout/flex';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FlexModule,
        MatButtonModule,
        RouterLink,
        PriceComponent,
        MatIconModule,
        NaturalIconDirective,
        MatDividerModule,
        RouterOutlet,
        NaturalEnumPipe,
    ],
})
export class CartComponent implements OnInit {
    /**
     * Eligible cart for Order
     */
    public cart?: Cart;

    public constructor(
        public readonly alertService: NaturalAlertService,
        public readonly router: Router,
        private readonly route: ActivatedRoute,
        public readonly cartService: CartService,
        public readonly currencyService: CurrencyService,
        private readonly globalCartService: GlobalCartService,
        private readonly cartCollectionService: CartCollectionService,
    ) {}

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
