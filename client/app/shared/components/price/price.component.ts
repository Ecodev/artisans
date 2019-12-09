import { Component, Input, OnInit } from '@angular/core';
import { NaturalAbstractController } from '@ecodev/natural';
import { takeUntil } from 'rxjs/operators';
import { CartLineProduct } from '../../../front-office/modules/cart/services/cart.service';
import { Currency, CurrencyManager } from '../../classes/currencyManager';

@Component({
    selector: 'app-price',
    templateUrl: './price.component.html',
    styleUrls: ['./price.component.scss'],
})
export class PriceComponent extends NaturalAbstractController implements OnInit {

    @Input() product: CartLineProduct;

    public price;

    /**
     * For template usage
     */
    public CurrencyManager = CurrencyManager;

    constructor() {
        super();
    }

    ngOnInit() {

        CurrencyManager.current.pipe(takeUntil(this.ngUnsubscribe)).subscribe(currency => {
            if (currency === Currency.CHF) {
                this.price = this.product.pricePerUnitCHF;
            } else {
                this.price = this.product.pricePerUnitEUR;
            }
        });

    }

}
