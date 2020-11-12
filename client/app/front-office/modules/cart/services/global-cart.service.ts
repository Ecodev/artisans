import {Inject, Injectable} from '@angular/core';
import {NaturalStorage, SESSION_STORAGE} from '@ecodev/natural';
import {Cart} from '../classes/cart';

@Injectable({
    providedIn: 'root',
})
export class GlobalCartService {
    private _cart: Cart;

    constructor(@Inject(SESSION_STORAGE) private readonly sessionStorage: NaturalStorage) {
        this.initializeFromStorage();
    }

    public get cart(): Cart {
        return this._cart;
    }

    public initializeFromStorage(): void {
        const persistedCart = Cart.getById(this.sessionStorage, 0);

        if (persistedCart) {
            this._cart = persistedCart;
        } else {
            this._cart = new Cart(this.sessionStorage, 0);
        }
    }
}
