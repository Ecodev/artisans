import {NaturalStorage, SESSION_STORAGE} from '@ecodev/natural';
import {Currency} from '../../../../shared/services/currency.service';
import {Injectable, inject} from '@angular/core';
import {Cart} from '../classes/cart';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CartCollectionService {
    private readonly storage = inject<NaturalStorage>(SESSION_STORAGE);

    public readonly cleared = new Subject<void>();

    public get currency(): Currency {
        return this._currency;
    }

    /**
     * Set current currency and trigger re-computing of all carts
     */
    public set currency(currency: Currency) {
        this._currency = currency;
        this.carts.forEach(cart => cart.computeTotals());
    }

    private _currency: Currency = Currency.CHF;
    private readonly storageKey = 'carts';
    private readonly carts: Cart[] = [];

    private getPersistedCarts(): any[] {
        const serializedStoredCarts = this.storage.getItem(this.storageKey);
        if (serializedStoredCarts) {
            return JSON.parse(serializedStoredCarts) as any[];
        }

        return [];
    }

    /**
     * Register new cart (but don't persist)
     */
    public add(cart: Cart): void {
        this.carts.push(cart);
    }

    public get length(): number {
        return this.carts.length;
    }

    /**
     * Persist existing cart into storage
     */
    public persist(cart: Cart): void {
        const persistedCarts = this.getPersistedCarts();

        persistedCarts[cart.id] = {
            productLines: cart.productLines,
            subscription: cart.subscription,
            donationAmount: cart.donationAmount,
        };

        this.storage.setItem(this.storageKey, JSON.stringify(persistedCarts));
    }

    /**
     * Delete all carts from memory and storage
     */
    public clear(): void {
        this.carts.forEach(c => c.empty());
        this.carts.length = 0;
        this.storage.setItem(this.storageKey, '');
        this.cleared.next();
    }

    /**
     * Get cart from memory if exists, or from storage if not
     */
    public getById(id: number): Cart | undefined {
        let cart = this.carts.find(c => c.id === id);

        if (cart) {
            return cart;
        }

        const carts = this.getPersistedCarts();

        if (carts[id]) {
            cart = new Cart(this, id);
            cart.productLines = carts[id].productLines || [];
            cart.subscription = carts[id].subscription;
            cart.donationAmount = carts[id].donationAmount;
            cart.computeTotals();

            return cart;
        }

        return;
    }
}
