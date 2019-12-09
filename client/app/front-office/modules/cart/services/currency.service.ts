import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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

    public readonly current: BehaviorSubject<Currency>;

    constructor() {

        const stored = sessionStorage.getItem('currency');

        if (stored === 'CHF') {
            this.current = new BehaviorSubject<Currency>(Currency.CHF);
        } else if (stored === 'EUR') {
            this.current = new BehaviorSubject<Currency>(Currency.EUR);
        } else {
            this.current = new BehaviorSubject<Currency>(Currency.CHF);
        }

    }

    public setCurrency(value: Currency) {
        this.current.next(value);
        sessionStorage.setItem('currency', value);
    }
}
