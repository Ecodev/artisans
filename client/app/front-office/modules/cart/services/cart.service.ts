import { Injectable } from '@angular/core';
import { NaturalAlertService } from '@ecodev/natural';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrderService } from '../../../../admin/order/services/order.service';
import { Currency, CurrencyManager } from '../../../../shared/classes/currencyManager';
import { OrderLineInput } from '../../../../shared/generated-types';
import { Cart } from '../classes/cart';

@Injectable({
    providedIn: 'root',
})
export class CartService {

    private static globalCartStorageKey = 'global-cart';

    constructor(private orderService: OrderService, private alertService: NaturalAlertService) {

        CartService.initGlobalCart();

        // If our cart changes in another browser tab, reload it from storage to keep it in sync
        fromEvent<StorageEvent>(window, 'storage').pipe(
            map(event => {
                if (event.key === CartService.globalCartStorageKey && event.newValue !== null) {
                    CartService.globalCart.setLines(JSON.parse(event.newValue));
                }
            }),
        ).subscribe();

        // On currency change, update carts totals
        CurrencyManager.current.subscribe(() => Cart.carts.forEach(cart => cart.computeTotals()));
    }

    public static _globalCart: Cart;

    public static get globalCart(): Cart {
        CartService.initGlobalCart();
        return CartService._globalCart;
    }

    private static initGlobalCart() {

        if (!CartService._globalCart) {
            CartService._globalCart = new Cart();
            CartService._globalCart.onChange.subscribe(() => localStorage.setItem(CartService.globalCartStorageKey,
                JSON.stringify(CartService._globalCart.lines)));
        }

        const storedLines = localStorage.getItem(CartService.globalCartStorageKey);

        if (storedLines) {
            const lines = JSON.parse(storedLines);
            CartService._globalCart.setLines(lines);
        }
    }

    public save(cart: Cart) {

        const input: OrderLineInput[] = cart.lines.map((line) => {
            return {
                product: line.product.id,
                quantity: line.quantity + '',
                type: line.type,
                isCHF: CurrencyManager.current.value === Currency.CHF,
            };
        });

        return this.orderService.create(input); // whines because of a number is provided instead of a string. TODO : fix
    }

}
