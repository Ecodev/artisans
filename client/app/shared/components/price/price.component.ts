import { Component, Input, OnInit } from '@angular/core';
import { NaturalAbstractController } from '@ecodev/natural';
import { takeUntil } from 'rxjs/operators';
import { CartLineProduct } from '../../../front-office/modules/cart/services/cart.service';
import { Currency, CurrencyService } from '../../../front-office/modules/cart/services/currency.service';

@Component({
    selector: 'app-price',
    templateUrl: './price.component.html',
    styleUrls: ['./price.component.scss'],
})
export class PriceComponent extends NaturalAbstractController implements OnInit {

    @Input() product: CartLineProduct;

    public price;

    constructor(public currencyService: CurrencyService) {
        super();
    }

    ngOnInit() {

        this.currencyService.current.pipe(takeUntil(this.ngUnsubscribe)).subscribe(currency => {
            if (currency === Currency.CHF) {
                this.price = this.product.pricePerUnitCHF;
            } else {
                this.price = this.product.pricePerUnitEUR;
            }
        });

    }

}
