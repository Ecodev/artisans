import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NaturalAlertService } from '@ecodev/natural';
import { CurrencyManager } from '../../../../../shared/classes/currencyManager';
import { ProductType } from '../../../../../shared/generated-types';
import { CartLineProduct, CartService } from '../../services/cart.service';

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

    constructor(public cartService: CartService, public alertService: NaturalAlertService, public router: Router) {

    }

    public ngOnInit(): void {
    }

    public createOrder() {
        this.alertService
            .confirm('Valider l\'achat',
                'Veuillez confirmer votre achat de ' + CartService.totalTaxInc.toFixed(2) + ' CHF',
                'Confirmer')
            .subscribe(
                confirm => {
                    if (confirm) {
                        this.cartService.save().subscribe(() => {
                            this.alertService.info('Votre commande a bien été enregistrée');
                            this.cartService.empty();
                        });
                    }
                });

    }

    public empty() {
        this.alertService
            .confirm('Vider le panier', 'Êtes-vous sûr de vouloir vider le panier ? Cette action est irréversible.', 'Vider le panier')
            .subscribe(confirm => {
                if (confirm) {
                    this.cartService.empty();
                }
            });
    }

    public increase(product: CartLineProduct, type: ProductType): void {
        this.cartService.increase(product, type, 1);
    }

    public decrease(product: CartLineProduct, type: ProductType): void {
        this.cartService.decrease(product, type, 1);

    }

}
