import { Injectable } from '@angular/core';
import { NaturalAlertService } from '@ecodev/natural';
import Decimal from 'decimal.js';
import { OrderService } from '../../order/services/order.service';
import { Product, Products } from '../../shared/generated-types';
import { moneyRoundUp } from '../../shared/utils';

export interface CartLine {
    product: Products['products']['items'][0] | Product['product'];
    quantity: number;
    total: number;
    pricePonderation: number;
}

@Injectable({
    providedIn: 'root',
})
export class CartService {

    public static totalTaxes = 0;
    public static totalTaxInc = 0;
    private static storageKey = 'chez-emmy-cart';
    public cart: CartLine[] = [];

    constructor(private orderService: OrderService, private alertService: NaturalAlertService) {
        const storedCart = sessionStorage.getItem(CartService.storageKey);
        if (storedCart) {
            this.cart = JSON.parse(storedCart);
            CartService.computeTotals(this.cart);
        }
    }

    public static getPriceTaxInc(product: CartLine['product'], quantity: number, ponderation: number): number {
        const quantifiedPrice = Decimal.mul(product.pricePerUnit, quantity);
        const ponderatedPrice = Decimal.mul(quantifiedPrice, ponderation);
        return moneyRoundUp(+ponderatedPrice);
    }

    private static persistCart(cart) {
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

    public add(product: CartLine['product'], quantity: number, ponderation: number) {

        const existingLineIndex = this.getLineIndexByProductAndPonderation(product, ponderation);

        if (existingLineIndex > -1) {
            const existingLine = this.cart[existingLineIndex];
            existingLine.quantity += quantity;
            existingLine.total = CartService.getPriceTaxInc(product, existingLine.quantity, ponderation);

        } else {
            this.cart.push({
                product: product,
                quantity: quantity,
                pricePonderation: ponderation,
                total: CartService.getPriceTaxInc(product, quantity, ponderation),
            });
        }

        CartService.persistCart(this.cart);
    }

    /**
     * Return a line from cart where product, quantity and price ponderation are identical
     * @param excludeIndex If provided ignore that index (permits to prevent colision in search)
     */
    public getLineIndexByProductAndPonderation(product: CartLine['product'], ponderation: number, excludeIndex?: number): number {
        return this.cart.findIndex((line: CartLine, index: number) => {
            return index === excludeIndex ? false : line.product.id === product.id && line.pricePonderation === ponderation;
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

    public updateProduct(index: number, quantity: number, pricePonderation: number) {

        const similarLineIndex = this.getLineIndexByProductAndPonderation(this.cart[index].product, pricePonderation, index);
        const currentLine = this.cart[index];

        // In case there is some other line with same parameters, merge them in the other line, and clear the current one
        if (similarLineIndex > -1) {
            const similarLine = this.cart[similarLineIndex];
            currentLine.quantity = quantity + similarLine.quantity;
            currentLine.pricePonderation = pricePonderation;
            currentLine.total = CartService.getPriceTaxInc(currentLine.product, currentLine.quantity, pricePonderation);
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
            currentLine.pricePonderation = pricePonderation;
            currentLine.total = CartService.getPriceTaxInc(currentLine.product, quantity, pricePonderation);
        }

        CartService.persistCart(this.cart);
    }

}
