import {Component, Input, OnInit} from '@angular/core';
import {NaturalAbstractController} from '@ecodev/natural';
import {takeUntil} from 'rxjs/operators';
import {CartLineProduct} from '../../../front-office/modules/cart/classes/cart';
import {Subscriptions} from '../../generated-types';
import {Currency, CurrencyService} from '../../services/currency.service';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-price',
    templateUrl: './price.component.html',
    styleUrl: './price.component.scss',
    standalone: true,
    imports: [CommonModule],
})
export class PriceComponent extends NaturalAbstractController implements OnInit {
    @Input({required: true}) public product!: CartLineProduct | Subscriptions['subscriptions']['items'][0];

    public price!: string;

    public constructor(public readonly currencyService: CurrencyService) {
        super();
    }

    public ngOnInit(): void {
        this.currencyService.current.pipe(takeUntil(this.ngUnsubscribe)).subscribe(currency => {
            if (currency === Currency.CHF) {
                this.price = this.product.pricePerUnitCHF;
            } else {
                this.price = this.product.pricePerUnitEUR;
            }
        });
    }
}
