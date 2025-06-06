import {Component, DestroyRef, inject, Input, OnInit} from '@angular/core';
import {CartLineProduct} from '../../../front-office/modules/cart/classes/cart';
import {Subscriptions} from '../../generated-types';
import {Currency, CurrencyService} from '../../services/currency.service';
import {CommonModule} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-price',
    templateUrl: './price.component.html',
    styleUrl: './price.component.scss',
    imports: [CommonModule],
})
export class PriceComponent implements OnInit {
    public readonly currencyService = inject(CurrencyService);

    private readonly destroyRef = inject(DestroyRef);
    @Input({required: true}) public product!: CartLineProduct | Subscriptions['subscriptions']['items'][0];

    public price!: string;

    public ngOnInit(): void {
        this.currencyService.current.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(currency => {
            if (currency === Currency.CHF) {
                this.price = this.product.pricePerUnitCHF;
            } else {
                this.price = this.product.pricePerUnitEUR;
            }
        });
    }
}
