import {Component, DestroyRef, inject, input, OnInit} from '@angular/core';
import {CartLineProduct} from '../../../front-office/modules/cart/classes/cart';
import {SubscriptionsQuery} from '../../generated-types';
import {Currency, CurrencyService} from '../../services/currency.service';
import {CurrencyPipe} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-price',
    imports: [CurrencyPipe],
    templateUrl: './price.component.html',
    styleUrl: './price.component.scss',
})
export class PriceComponent implements OnInit {
    protected readonly currencyService = inject(CurrencyService);

    private readonly destroyRef = inject(DestroyRef);
    public readonly product = input.required<CartLineProduct | SubscriptionsQuery['subscriptions']['items'][0]>();

    protected price!: string;

    public ngOnInit(): void {
        this.currencyService.current.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(currency => {
            if (currency === Currency.CHF) {
                this.price = this.product().pricePerUnitCHF;
            } else {
                this.price = this.product().pricePerUnitEUR;
            }
        });
    }
}
