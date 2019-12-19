import { Injectable } from '@angular/core';
import { NaturalAlertService } from '@ecodev/natural';
import Decimal from 'decimal.js';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrderService } from '../../../../order/services/order.service';
import { CurrencyManager } from '../../../../shared/classes/currencyManager';
import { Product, Products, ProductType } from '../../../../shared/generated-types';
import { moneyRoundUp } from '../../../../shared/utils';

export type CartLineProduct =
    Products['products']['items'][0]
    | Product['product'];

export interface CartLine {
    product: CartLineProduct;
    type: ProductType;
    quantity: number;
    total: number;
}

@Injectable({
    providedIn: 'root',
})
export class CartService {

    public static totalTaxInc = 0;
    private static storageKey = 'artisans-cart';
    public cart: CartLine[] = [];

    constructor(private orderService: OrderService, private alertService: NaturalAlertService) {

        // If our cart changes in another browser tab, reload it from storage to keep it in sync
        fromEvent<StorageEvent>(window, 'storage').pipe(
            map(event => {
                if (event.key === CartService.storageKey && event.newValue !== null) {
                    this.cart = JSON.parse(event.newValue);
                    CartService.computeTotals(this.cart);
                }
            }),
        ).subscribe();

        const storedCart = localStorage.getItem(CartService.storageKey);
        if (storedCart) {
            this.cart = JSON.parse(storedCart);
            CartService.computeTotals(this.cart);
        }
    }

    public static getPriceTaxInc(product: CartLineProduct, quantity: number): number {
        const quantifiedPrice = Decimal.mul(CurrencyManager.getPriceByCurrency(product), quantity);
        return moneyRoundUp(+quantifiedPrice);
    }

    private static persistCart(cart) {
        CartService.computeTotals(cart);
        localStorage.setItem(CartService.storageKey, JSON.stringify(cart));
    }

    private static computeTotals(cart) {
        CartService.totalTaxInc = cart.reduce((a, line) => a + line.total, 0);
    }

    public save() {
        return this.orderService.create(this.cart as any); // whines because of a number is provided instead of a string. TODO : fix
    }

    public increase(product: CartLineProduct, type: ProductType, quantity: number) {

        const line = this.getLineByProduct(product, type);

        if (line) {
            line.quantity += quantity;
            line.total = CartService.getPriceTaxInc(product, line.quantity);

        } else {
            this.cart.push({
                product: product,
                type: type,
                quantity: quantity,
                total: CartService.getPriceTaxInc(product, quantity),
            });
        }

        CartService.persistCart(this.cart);
    }

    public decrease(product: CartLineProduct, type: ProductType, quantity: number) {

        const line = this.getLineByProduct(product, type);

        if (line) {
            const newQuantity = line.quantity - quantity;

            if (newQuantity <= 0) {
                // If quantity is falsey, remove from cart
                this.remove(product);
            } else {
                // If product exist and quantity is truey, update existing entry
                line.quantity = newQuantity;
                line.total = CartService.getPriceTaxInc(line.product, line.quantity);
            }
        }

        CartService.persistCart(this.cart);

    }

    /**
     * Return a line from cart where product, quantity are identical
     */
    public getLineByProduct(product: CartLineProduct, type: ProductType): CartLine | undefined {
        return this.cart.find(line => line.product.id === product.id && line.type === type);
    }

    public remove(product: CartLineProduct) {
        const index = this.cart.findIndex(line => line.product.id === product.id);
        this.cart.splice(index, 1);
        CartService.persistCart(this.cart);
    }

    public empty() {
        this.cart = [];
        CartService.persistCart(this.cart);
    }

}
