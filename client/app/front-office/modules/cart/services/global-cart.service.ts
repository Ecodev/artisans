import {Injectable} from '@angular/core';
import {Cart} from '../classes/cart';
import {CartCollectionService} from './cart-collection.service';

@Injectable({
    providedIn: 'root',
})
export class GlobalCartService {
    private _cart: Cart;

    constructor(private readonly cartCollectionService: CartCollectionService) {
        this.initializeFromStorage();
    }

    public get cart(): Cart {
        return this._cart;
    }

    public initializeFromStorage(): void {
        const persistedCart = this.cartCollectionService.getById(0);

        if (persistedCart) {
            this._cart = persistedCart;
        } else {
            this._cart = new Cart(this.cartCollectionService, 0);
        }
    }
}
