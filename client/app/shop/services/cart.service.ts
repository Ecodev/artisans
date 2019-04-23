import { Injectable } from '@angular/core';
import { Product, Products } from '../../shared/generated-types';

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
    public static totalTaxExc = 0;
    private static storageKey = 'chez-emmy-cart';
    public cart: CartLine[] = [];

    constructor() {
        const storedCart = sessionStorage.getItem(CartService.storageKey);
        if (storedCart) {
            this.cart = JSON.parse(storedCart);
            CartService.computeTotals(this.cart);
        }
    }

    public static getTax(product: CartLine['product'], quantity: number): number {
        const ht = CartService.getPriceTaxExc(product, quantity);
        const tax = CartService.multiplyDecimal(Number(product.vatRate), 0.01);
        return CartService.multiplyDecimal(ht, tax);
    }

    public static getPriceTaxExc(product: CartLine['product'], quantity: number): number {
        return CartService.multiplyDecimal(Number(product.pricePerUnit), quantity);
    }

    public static getPriceTaxInc(product: CartLine['product'], quantity: number): number {
        const ht = CartService.getPriceTaxExc(product, quantity);
        const tax = CartService.getTax(product, quantity);
        return ht + tax;
    }

    /**
     * When 0.3999 * 100  we get 0.3989999999999995 due to floating imprecision
     * To prevent that, first we multiply each number to get two integers and then we multiply them and re-divide
     */
    public static multiplyDecimal(nb1: number, nb2: number): number {

        const precision1 = CartService.decimalCount(nb1);
        const precision2 = CartService.decimalCount(nb2);
        const precision = Math.max(precision1, precision2);

        const multiplicator = Math.pow(10, precision); // transform number of digits into 10^digits

        return ((nb1 * multiplicator) * (nb2 * multiplicator)) / (multiplicator * multiplicator);
    }

    public static decimalCount(number: number): number {
        if (Math.floor(number) === number) {
            return 0;
        }

        return number.toString().split('.')[1].length || 0;
    }

    private static saveCart(cart) {
        CartService.computeTotals(cart);
        sessionStorage.setItem(CartService.storageKey, JSON.stringify(cart));
    }

    private static computeTotals(cart) {

        CartService.totalTaxes = 0;
        CartService.totalTaxExc = 0;
        CartService.totalTaxInc = 0;
        cart.forEach(line => {
            const ht = this.getPriceTaxExc(line.product, line.quantity);
            const tax = this.getTax(line.product, line.quantity);
            const ttc = this.getPriceTaxInc(line.product, line.quantity);

            CartService.totalTaxExc += ht;
            CartService.totalTaxes += tax;
            CartService.totalTaxInc += ttc;

        });
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
