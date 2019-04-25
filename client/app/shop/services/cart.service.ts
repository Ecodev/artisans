import { Injectable } from '@angular/core';
import Decimal from 'decimal.js';
import { OrderService } from '../../order/services/order.service';
import { Product, Products } from '../../shared/generated-types';
import { moneyRoundUp } from '../../shared/utils';

export interface CartLine {
    product: Products['products']['items'][0] | Product['product'];
    quantity: number;
    total: number;
}

@Injectable({
    providedIn: 'root',
})
export class CartService {

    public static totalTaxes = 0;
    public static totalTaxInc = 0;
    private static storageKey = 'chez-emmy-cart';
    public cart: CartLine[] = [];

    constructor(private orderService: OrderService) {
        const storedCart = sessionStorage.getItem(CartService.storageKey);
        if (storedCart) {
            this.cart = JSON.parse(storedCart);
            CartService.computeTotals(this.cart);
        }
    }

    public static getPriceTaxInc(product: CartLine['product'], quantity: number = 1): number {
        return moneyRoundUp(+Decimal.mul(product.pricePerUnit, quantity));
    }

    private static saveCart(cart) {
        CartService.computeTotals(cart);
        sessionStorage.setItem(CartService.storageKey, JSON.stringify(cart));
    }

    private static computeTotals(cart) {
        CartService.totalTaxes = cart.reduce((a, line) => a + line.total - +Decimal.div(line.total, +line.product.vatRate + 1), 0);
        CartService.totalTaxInc = cart.reduce((a, line) => a + line.total, 0);
    }

    public save() {
        return this.orderService.create(this.cart as any); // whines because of a number is provided instead of a string. TODO : fix
    }

    public add(product: CartLine['product'], quantity) {

        const existingLine = this.cart.find(line => line.product.id === product.id);

        if (existingLine) {
            existingLine.quantity += quantity;
            existingLine.total = CartService.getPriceTaxInc(product, existingLine.quantity);
        } else {
            this.cart.push({
                product: product,
                quantity: quantity,
                total: CartService.getPriceTaxInc(product, quantity),
            });
        }

        CartService.saveCart(this.cart);

    }

    public remove(product: CartLine['product']) {
        const index = this.cart.findIndex(line => line.product.id === product.id);
        if (index > -1) {
            this.cart.splice(index, 1);
            CartService.saveCart(this.cart);
        }
    }

    public empty() {
        this.cart = [];
        CartService.saveCart(this.cart);
    }

    public setQuantity(product: CartLine['product'], quantity: number) {

        const line = this.cart.find(l => l.product.id === product.id);

        // If no product, or no quantity, stop it
        if (!line && quantity <= 0) {
            return;
        }

        // If product does not exist in cart, add it with defined quantity
        if (!line) {
            this.add(product, quantity);
            return;
        }

        // If line has been found, but quantity is falsey, remove from cart
        if (quantity <= 0) {
            this.remove(product);
        }

        // If product exist and quantity is truey, update existing entry
        line.quantity = quantity;
        line.total = CartService.getPriceTaxInc(line.product, quantity);

        CartService.saveCart(this.cart);
    }

}
