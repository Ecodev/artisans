import Decimal from 'decimal.js';
import { Subject } from 'rxjs';
import { CurrencyManager } from '../../../../shared/classes/currencyManager';
import {
    Product_product,
    Products_products_items,
    ProductType,
    Subscription_subscription,
    Subscriptions_subscriptions_items,
} from '../../../../shared/generated-types';
import { moneyRoundUp } from '../../../../shared/utils';
import { CartService } from '../services/cart.service';

export type CartLineProduct =
    Products_products_items
    | Product_product;

export type CartLineSubscription =
    Subscriptions_subscriptions_items
    | Subscription_subscription;

export interface CartLine {
    /**
     * Related product
     */
    product: CartLineProduct;

    /**
     * Type (paper/web) of product added to cart
     */
    type: ProductType;

    /**
     * Number of instances of given product added to cart
     */
    quantity: number;

    /**
     * Total in current currency
     */
    totalTaxInc: number;
}

export class Cart {

    private static storageKey = 'carts';

    public static carts: Cart[] = [];

    /**
     * Cart detail
     */
    public productLines: CartLine[] = [];

    /**
     * Total including taxes
     */
    public totalTaxInc: number;

    /**
     * Emits when cart changes
     */
    public readonly onChange = new Subject();

    /**
     * Single donation amount
     */
    public donationAmount = 0;

    /**
     * Single subscription setup
     */
    public subscription: null | { subscription: CartLineSubscription, emails?: string[], type: ProductType } = null;

    /**
     * Cart identification
     */
    private _id: number;

    /**
     *
     */
    public static getPersistedCarts(): any[] {
        const serializedStoredCarts = sessionStorage.getItem(Cart.storageKey);
        if (serializedStoredCarts) {
            return JSON.parse(serializedStoredCarts) as Cart[];
        }

        return [];
    }


    public static clearCarts() {
        Cart.carts.forEach(c => c.empty());
        Cart.carts.length = 0;
        sessionStorage.setItem(Cart.storageKey, '');
        CartService.initGlobalCart();
    }

    /**
     * On new cart, never recover from session storage
     * @param id Use id param only for global cart
     */
    public constructor(id?: number) {
        this._id = id || Cart.carts.length;
        Cart.carts.push(this);
    }

    public get id() {
        return this._id;
    }

    /**
     * Get cart from memory if exists, or from sessionStorage if not
     */
    public static getById(id: number): Cart | undefined {
        let cart = Cart.carts.find(c => c._id === id);

        if (cart) {
            return cart;
        }

        const carts = this.getPersistedCarts();

        if (carts[id]) {
            cart = new Cart(id);
            cart.productLines = carts[id].productLines || [];
            cart.subscription = carts[id].subscription;
            cart.donationAmount = carts[id].donationAmount;
            cart.computeTotals();
            return cart;
        }

        return;
    }

    /**
     * todo : update on currency change ?
     */
    public static getPriceTaxInc(product: { pricePerUnitCHF?, pricePerUnitEUR? }, quantity: number): number {
        // todo : drop decimaljs ?
        const quantifiedPrice = Decimal.mul(CurrencyManager.getPriceByCurrency(product), quantity);
        return moneyRoundUp(+quantifiedPrice);
    }

    public update() {
        this.computeTotals();

        const carts = Cart.getPersistedCarts();

        carts[this._id] = {
            productLines: this.productLines,
            subscription: this.subscription,
            donationAmount: this.donationAmount,
        };

        sessionStorage.setItem(Cart.storageKey, JSON.stringify(carts));
    }

    public addProduct(product: CartLineProduct, type: ProductType, quantity: number = 1) {

        const line = this.getLineByProduct(product, type);

        if (line) {
            line.quantity += quantity;
            line.totalTaxInc = Cart.getPriceTaxInc(product, line.quantity);

        } else {
            this.productLines.push({
                product: product,
                type: type,
                quantity: quantity,
                totalTaxInc: Cart.getPriceTaxInc(product, quantity),
            });
        }

        this.update();
    }

    public removeProduct(product: CartLineProduct, type: ProductType, quantity: number) {

        const line = this.getLineByProduct(product, type);

        if (line) {
            const newQuantity = line.quantity - quantity;

            if (newQuantity <= 0) {
                // If quantity is falsey, remove from cart
                this.remove(product);
            } else {
                // If product exist and quantity is truey, update existing entry
                line.quantity = newQuantity;
                line.totalTaxInc = Cart.getPriceTaxInc(line.product, line.quantity);
            }
        }

        this.update();
    }

    /**
     * A subscription is a standalone buy. There can't be more than one, and should not share order with products
     */
    public setSubscription(subscription: CartLineSubscription, type: ProductType, emails?: string[]) {
        this.subscription = {subscription, type, emails};
        this.update();
    }

    public unsetSubscription() {
        this.subscription = null;
        this.update();
    }

    /**
     * A donation is a unique amount in an order.
     */
    public setDonation(value: number) {
        this.donationAmount = value;
        this.update();
    }

    public unsetDonation() {
        this.donationAmount = 0;
        this.update();
    }

    /**
     * Return a line from cart where product, quantity are identical
     */
    public getLineByProduct(product: CartLineProduct, type: ProductType): CartLine | undefined {
        return this.productLines.find(line => line.product.id === product.id && line.type === type);
    }

    public remove(product: CartLineProduct) {
        const index = this.productLines.findIndex(line => line.product.id === product.id);
        this.productLines.splice(index, 1);
        this.update();
    }

    public empty() {
        this.productLines = [];
        this.update();
    }

    public setLines(lines: CartLine[]) {
        this.productLines = lines;
        this.computeTotals();
    }

    public computeTotals() {

        let totals = this.productLines.reduce((a, line) => {
            line.totalTaxInc = Cart.getPriceTaxInc(line.product, line.quantity); // update line total
            return a + line.totalTaxInc; // stack for cart total
        }, 0);

        if (this.subscription) {
            totals += Cart.getPriceTaxInc(this.subscription.subscription, 1);
        }

        if (this.donationAmount > 0) {
            totals += this.donationAmount;
        }

        this.totalTaxInc = totals;
    }

    public isEmpty(): boolean {
        return !this.productLines.length && !this.subscription && !this.donationAmount;
    }

}
