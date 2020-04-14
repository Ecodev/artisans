import Decimal from 'decimal.js';
import { Currency } from '../../../../shared/services/currency.service';
import {
    Product_product,
    Products_products_items,
    ProductType,
    Subscription_subscription,
    Subscriptions_subscriptions_items,
} from '../../../../shared/generated-types';
import { moneyRoundUp } from '../../../../shared/utils';
import { NaturalStorage } from '@ecodev/natural';

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

    private static readonly storageKey = 'carts';

    private static carts: Cart[] = [];

    private static currency: Currency = Currency.CHF;

    /**
     * Cart detail
     */
    public productLines: CartLine[] = [];

    /**
     * Total including taxes
     */
    public totalTaxInc: number;

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
    private readonly _id: number;

    private static getPersistedCarts(storage: NaturalStorage): any[] {
        const serializedStoredCarts = storage.getItem(Cart.storageKey);
        if (serializedStoredCarts) {
            return JSON.parse(serializedStoredCarts) as any[];
        }

        return [];
    }

    /**
     * Set current currency and trigger re-computing of all carts
     */
    public static setCurrency(currency: Currency): void {
        this.currency = currency;
        this.carts.forEach(cart => cart.computeTotals());
    }

    /**
     * Delete all carts from memory and storage
     */
    public static clearCarts(storage: NaturalStorage): void {
        this.carts.forEach(c => c.empty());
        this.carts.length = 0;
        storage.setItem(Cart.storageKey, '');
    }

    /**
     * On new cart, never recover from session storage
     * @param id Use id param only for global cart
     */
    public constructor(private readonly storage: NaturalStorage, id?: number) {
        this._id = id || Cart.carts.length;
        Cart.carts.push(this);
    }

    public get id(): number {
        return this._id;
    }

    /**
     * Get cart from memory if exists, or from storage if not
     */
    public static getById(storage: NaturalStorage, id: number): Cart | undefined {
        let cart = Cart.carts.find(c => c._id === id);

        if (cart) {
            return cart;
        }

        const carts = this.getPersistedCarts(storage);

        if (carts[id]) {
            cart = new Cart(storage, id);
            cart.productLines = carts[id].productLines || [];
            cart.subscription = carts[id].subscription;
            cart.donationAmount = carts[id].donationAmount;
            cart.computeTotals();

            return cart;
        }
    }

    private static getPriceTaxInc(product: { pricePerUnitCHF?, pricePerUnitEUR? }, quantity: number): number {
        // todo : drop decimaljs ?
        const quantifiedPrice = Decimal.mul(Cart.getPriceByCurrency(product), quantity);
        return moneyRoundUp(+quantifiedPrice);
    }

    private static getPriceByCurrency(product: { pricePerUnitCHF?, pricePerUnitEUR? }): Decimal.Value {

        if (this.currency === Currency.CHF) {
            return product.pricePerUnitCHF;
        } else if (this.currency === Currency.EUR) {
            return product.pricePerUnitEUR;
        }

        throw new Error('Unsupported currency: ' + this.currency);
    }

    public update() {
        this.computeTotals();

        const carts = Cart.getPersistedCarts(this.storage);

        carts[this._id] = {
            productLines: this.productLines,
            subscription: this.subscription,
            donationAmount: this.donationAmount,
        };

        this.storage.setItem(Cart.storageKey, JSON.stringify(carts));
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
