import Decimal from 'decimal.js';
import {Provider} from '@angular/core';
import {LOCAL_STORAGE, NaturalMemoryStorage, SESSION_STORAGE} from '@ecodev/natural';

export function moneyRoundUp(amount: number): number {
    return Math.ceil(+Decimal.mul(amount, 100)) / 100;
}

/**
 * Copy text to clipboard.
 * Accepts line breaks \n as textarea do.
 */
export function copy(document: Document, value: string): void {
    const input = document.createElement('textarea');
    document.body.append(input);
    input.value = value;
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
}

/**
 * Provides session storage in browser or falls back on memory storage for SSR
 */
export const ssrCompatibleSessionStorageProvider: Provider = {
    provide: SESSION_STORAGE,
    // tslint:disable-next-line:no-restricted-globals
    useFactory: () => (typeof sessionStorage === 'undefined' ? new NaturalMemoryStorage() : sessionStorage),
};

/**
 * Provides local storage in browser or falls back on memory storage for SSR
 */
export const ssrCompatibleLocalStorageProvider: Provider = {
    provide: LOCAL_STORAGE,
    // tslint:disable-next-line:no-restricted-globals
    useFactory: () => (typeof localStorage === 'undefined' ? new NaturalMemoryStorage() : localStorage),
};
