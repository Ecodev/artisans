import Decimal from 'decimal.js';
import { Subject } from 'rxjs';
import { CurrencyManager } from '../../../../shared/classes/currencyManager';
import {
    Product_product,
    Products_products_items,
    ProductType,
    Subscriptions_subscriptions_items,
} from '../../../../shared/generated-types';
import { moneyRoundUp } from '../../../../shared/utils';

export type CartLineProduct =
    Products_products_items
    | Product_product
    | Subscriptions_subscriptions_items;

export interface CartLine {
    product: CartLineProduct;
    type: ProductType;
    quantity: number;

    /**
     * Total in current currency
     */
    totalTaxInc: number;
}

export class Cart {

    public static carts: Cart[] = [];

    /**
     * Cart detail
     */
    public lines: CartLine[] = [];

    /**
     * Cart identification
     */
    private _id: number;

    /**
     * Total including taxes
     */
    public totalTaxInc: number;

    public readonly onChange = new Subject();

    public constructor() {
        this._id = Cart.carts.length;
        Cart.carts.push(this);
    }

    public static getById(id: number): Cart | undefined {
        return Cart.carts.find(c => c._id === id);
    }

    public get id() {
        return this._id;
    }

    /**
     * todo : update on currency change ?
     */
    public static getPriceTaxInc(product: CartLineProduct, quantity: number): number {
        // todo : drop decimaljs ?
        const quantifiedPrice = Decimal.mul(CurrencyManager.getPriceByCurrency(product), quantity);
        return moneyRoundUp(+quantifiedPrice);
    }

    public update() {
        this.computeTotals();
        this.onChange.next();
    }

    public increase(product: CartLineProduct, type: ProductType, quantity: number = 1) {

        const line = this.getLineByProduct(product, type);

        if (line) {
            line.quantity += quantity;
            line.totalTaxInc = Cart.getPriceTaxInc(product, line.quantity);

        } else {
            this.lines.push({
                product: product,
                type: type,
                quantity: quantity,
                totalTaxInc: Cart.getPriceTaxInc(product, quantity),
            });
        }

        this.update();
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
                line.totalTaxInc = Cart.getPriceTaxInc(line.product, line.quantity);
            }
        }

        this.update();

    }

    /**
     * Return a line from cart where product, quantity are identical
     */
    public getLineByProduct(product: CartLineProduct, type: ProductType): CartLine | undefined {
        return this.lines.find(line => line.product.id === product.id && line.type === type);
    }

    public remove(product: CartLineProduct) {
        const index = this.lines.findIndex(line => line.product.id === product.id);
        this.lines.splice(index, 1);
        this.update();
    }

    public empty() {
        this.lines = [];
        this.update();
    }

    public setLines(lines: CartLine[]) {
        this.lines = lines;
        this.computeTotals();
    }

    public computeTotals() {
        this.totalTaxInc = this.lines.reduce((a, line) => {
            line.totalTaxInc = Cart.getPriceTaxInc(line.product, line.quantity); // update line total
            return a + line.totalTaxInc; // stack for cart total
        }, 0);
    }
}
