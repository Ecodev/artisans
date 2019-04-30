import Decimal from 'decimal.js';

export function moneyRoundUp(amount: number): number {
    return Math.ceil(+Decimal.mul(amount, 100)) / 100;
}

export function calculateSuggestedPrice(supplierPrice: string, margin: string, vatRate: string): number {
    const priceWithMargin = +supplierPrice + (+supplierPrice * +margin);
    const priceWithTaxes = priceWithMargin + priceWithMargin * +vatRate;

    return priceWithTaxes;
}
