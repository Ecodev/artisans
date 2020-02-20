import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { OrderService } from '../../../../admin/order/services/order.service';
import { Currency, CurrencyManager } from '../../../../shared/classes/currencyManager';
import { OrderLineInput } from '../../../../shared/generated-types';
import { DonationComponent } from '../../../components/donation/donation.component';
import { Cart } from '../classes/cart';

@Injectable({
    providedIn: 'root',
})
export class CartService {

    public static _globalCart: Cart;

    public static clearCarts() {
        Cart.carts.forEach(c => c.empty());
        Cart.carts.length = 0;
        sessionStorage.setItem(Cart.storageKey, '');
        CartService.initGlobalCart();
    }

    constructor(private orderService: OrderService, private dialogService: MatDialog) {

        // If our cart changes in another browser tab, reload it from storage to keep it in sync
        // fromEvent<StorageEvent>(window, 'storage').pipe(
        //     map(event => {
        //         if (event.key === CartService.globalCartStorageKey && event.newValue !== null) {
        //             CartService.globalCart.setLines(JSON.parse(event.newValue));
        //         }
        //     }),
        // ).subscribe();

        // On currency change, update carts totals
        CurrencyManager.current.subscribe(() => Cart.carts.forEach(cart => cart.computeTotals()));
    }

    public static get globalCart(): Cart {
        return CartService._globalCart;
    }

    public static initGlobalCart() {
        const persistedCart = Cart.getById(0);

        if (persistedCart) {
            CartService._globalCart = persistedCart;
        } else {
            CartService._globalCart = new Cart(0);
        }
    }

    public save(cart: Cart) {

        const input: OrderLineInput[] = cart.productLines.map((line) => {
            return {
                product: line.product.id,
                quantity: line.quantity + '',
                type: line.type,
                isCHF: CurrencyManager.current.value === Currency.CHF,
            };
        });

        return this.orderService.create(input); // whines because of a number is provided instead of a string. TODO : fix
    }

    /**
     * Prompts the user to manually set the donation amount
     */
    public inputDonation(cart?: Cart) {

        this.dialogService.open(DonationComponent).afterClosed().subscribe(amount => {
            if (amount != null) {

                if (!cart) {
                    cart = CartService.globalCart;
                }

                cart.setDonation(amount);
            }
        });

    }

}
