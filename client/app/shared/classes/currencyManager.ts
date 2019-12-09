import { BehaviorSubject } from 'rxjs';

/**
 * Value from https://en.wikipedia.org/wiki/ISO_4217
 */
export enum Currency {
    CHF = 'CHF',
    EUR = 'EUR'
}

export class CurrencyManager {

    public static readonly current: BehaviorSubject<Currency> = new BehaviorSubject<Currency>(Currency.CHF);

    constructor() {

        const stored = sessionStorage.getItem('currency');

        if (stored === 'CHF') {
            CurrencyManager.current.next(Currency.CHF);
        } else if (stored === 'EUR') {
            CurrencyManager.current.next(Currency.EUR);
        }

    }

    public static getPriceByCurrency(product) {

        if (CurrencyManager.current.value === Currency.CHF) {
            return product.pricePerUnitCHF;
        } else if (CurrencyManager.current.value === Currency.EUR) {
            return product.pricePerUnitEUR;
        }
    }

    public static setCurrency(value: Currency) {
        CurrencyManager.current.next(value);
        sessionStorage.setItem('currency', value);
    }
}
