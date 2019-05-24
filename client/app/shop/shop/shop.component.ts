import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NaturalAlertService } from '@ecodev/natural';
import { CartService } from '../services/cart.service';
import { QrService } from '../services/qr.service';

@Component({
    selector: 'app-shop',
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit, OnDestroy {

    public mode;
    public CartService = CartService;

    constructor(public cartService: CartService,
                public alertService: NaturalAlertService,
                public router: Router,
                private qrService: QrService,
    ) {

    }

    ngOnInit() {
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

    ngOnDestroy(): void {
        this.qrService.stop();
    }

}
