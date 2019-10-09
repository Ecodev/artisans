import { Injectable } from '@angular/core';
import { NaturalAlertService } from '@ecodev/natural';
import Decimal from 'decimal.js';
import { OrderService } from '../../order/services/order.service';
import { Product, Products } from '../../shared/generated-types';
import { moneyRoundUp } from '../../shared/utils';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

export interface CartLine {
    product: Products['products']['items'][0] | Product['product'];
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

    public static getPriceTaxInc(product: CartLine['product'], quantity: number): number {
        // TODO add parameter to switch between CHF and EUR
        const quantifiedPrice = Decimal.mul(product.pricePerUnitCHF, quantity);
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

    public add(product: CartLine['product'], quantity: number) {

        const existingLineIndex = this.getLineIndexByProduct(product);

        if (existingLineIndex > -1) {
            const existingLine = this.cart[existingLineIndex];
            existingLine.quantity += quantity;
            existingLine.total = CartService.getPriceTaxInc(product, existingLine.quantity);

        } else {
            this.cart.push({
                product: product,
                quantity: quantity,
                total: CartService.getPriceTaxInc(product, quantity),
            });
        }

        CartService.persistCart(this.cart);
    }

    /**
     * Return a line from cart where product, quantity are identical
     * @param excludeIndex If provided ignore that index (permits to prevent collision in search)
     */
    public getLineIndexByProduct(product: CartLine['product'], excludeIndex?: number): number {
        return this.cart.findIndex((line: CartLine, index: number) => {
            return index === excludeIndex ? false : line.product.id === product.id;
        });
    }

    public remove(index: number) {
        this.cart.splice(index, 1);
        CartService.persistCart(this.cart);
    }

    public empty() {
        this.cart = [];
        CartService.persistCart(this.cart);
    }

    public updateProduct(index: number, quantity: number) {

        const similarLineIndex = this.getLineIndexByProduct(this.cart[index].product, index);
        const currentLine = this.cart[index];

        // In case there is some other line with same parameters, merge them in the other line, and clear the current one
        if (similarLineIndex > -1) {
            const similarLine = this.cart[similarLineIndex];
            currentLine.quantity = quantity + similarLine.quantity;
            currentLine.total = CartService.getPriceTaxInc(currentLine.product, currentLine.quantity);
            this.remove(similarLineIndex);
            this.alertService.info('Deux produits partageant les mêmes caractéristiques ont été combinés');
            CartService.persistCart(this.cart);
            return;
        }

        if (quantity <= 0) {
            // If quantity is falsey, remove from cart
            this.remove(index);
        } else {
            // If product exist and quantity is truey, update existing entry
            currentLine.quantity = quantity;
            currentLine.total = CartService.getPriceTaxInc(currentLine.product, quantity);
        }

        CartService.persistCart(this.cart);
    }

}
