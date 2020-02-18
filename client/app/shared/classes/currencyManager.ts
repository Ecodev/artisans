import { BehaviorSubject } from 'rxjs';
import { UserLike } from '../../admin/users/services/user.service';

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

    /**
     * Prevents to change currency
     */
    private static _locked = false;

    public static get locked(): boolean {
        return CurrencyManager._locked;
    }

    public static set locked(value: boolean) {
        CurrencyManager._locked = value;
    }

    public static getPriceByCurrency(product) {

        if (CurrencyManager.current.value === Currency.CHF) {
            return product.pricePerUnitCHF;
        } else if (CurrencyManager.current.value === Currency.EUR) {
            return product.pricePerUnitEUR;
        }
    }

    public static setCurrency(value: Currency) {

        if (CurrencyManager.locked) {
            return;
        }

        CurrencyManager.current.next(value);
        sessionStorage.setItem('currency', value);
    }

    /**
     * Consider the given user country to (un)lock currency change
     */
    public static updateLockedStatus(user: UserLike | null) {

        if (!user || !user.country) {
            CurrencyManager.locked = false;
            return;
        }

        if (user.country.id === '1') {
            CurrencyManager.setCurrency(Currency.CHF);
        } else {
            CurrencyManager.setCurrency(Currency.EUR);
        }

        CurrencyManager.locked = true;

    }
}
