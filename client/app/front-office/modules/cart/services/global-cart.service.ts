import {inject, Injectable, OnDestroy} from '@angular/core';
import {Cart} from '../classes/cart';
import {CartCollectionService} from './cart-collection.service';
import {Subscription} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GlobalCartService implements OnDestroy {
    private readonly cartCollectionService = inject(CartCollectionService);

    private _cart!: Cart;
    private readonly subscription: Subscription;

    public constructor() {
        // Whenever carts are cleared, we reload an empty global cart
        this.subscription = this.cartCollectionService.cleared.subscribe(() => this.initializeFromStorage());
        this.initializeFromStorage();
    }

    public get cart(): Cart {
        return this._cart;
    }

    private initializeFromStorage(): void {
        const persistedCart = this.cartCollectionService.getById(0);

        if (persistedCart) {
            this._cart = persistedCart;
        } else {
            this._cart = new Cart(this.cartCollectionService, 0);
        }
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
