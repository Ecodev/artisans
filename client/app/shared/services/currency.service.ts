import { BehaviorSubject } from 'rxjs';
import { UserLike } from '../../admin/users/services/user.service';
import { Injectable } from '@angular/core';

/**
 * Value from https://en.wikipedia.org/wiki/ISO_4217
 */
export enum Currency {
    CHF = 'CHF',
    EUR = 'EUR'
}

@Injectable({
    providedIn: 'root',
})
export class CurrencyService {

    public readonly current: BehaviorSubject<Currency> = new BehaviorSubject<Currency>(Currency.CHF);

    constructor() {
        const stored = sessionStorage.getItem('currency');

        if (stored === 'CHF') {
            this.current.next(Currency.CHF);
        } else if (stored === 'EUR') {
            this.current.next(Currency.EUR);
        }
    }

    /**
     * Prevents to change currency
     */
    public locked = false;

    public setCurrency(value: Currency): void {

        if (this.locked) {
            return;
        }

        this.current.next(value);
        sessionStorage.setItem('currency', value);
    }

    /**
     * Consider the given user country to (un)lock currency change
     */
    public updateLockedStatus(user: UserLike | null): void {
        if (!user || !user.country) {
            this.locked = false;
            return;
        }

        if (user.country.id === '1') {
            this.setCurrency(Currency.CHF);
        } else {
            this.setCurrency(Currency.EUR);
        }

        this.locked = true;
    }
}
