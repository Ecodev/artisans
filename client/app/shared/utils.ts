import Decimal from 'decimal.js';

export function moneyRoundUp(amount: number): number {
    return Math.ceil(+Decimal.mul(amount, 100)) / 100;
}

export function calculateSuggestedPrice(supplierPrice: string, margin: string, vatRate: string): number {
    const priceWithMargin = +supplierPrice + (+supplierPrice * +margin);
    const priceWithTaxes = priceWithMargin + priceWithMargin * +vatRate;

    return priceWithTaxes;
}

export function mod10Recursive(code: string): number {

    const table = [
        [0, 9, 4, 6, 8, 2, 7, 1, 3, 5],
        [9, 4, 6, 8, 2, 7, 1, 3, 5, 0],
        [4, 6, 8, 2, 7, 1, 3, 5, 0, 9],
        [6, 8, 2, 7, 1, 3, 5, 0, 9, 4],
        [8, 2, 7, 1, 3, 5, 0, 9, 4, 6],
        [2, 7, 1, 3, 5, 0, 9, 4, 6, 8],
        [7, 1, 3, 5, 0, 9, 4, 6, 8, 2],
        [1, 3, 5, 0, 9, 4, 6, 8, 2, 7],
        [3, 5, 0, 9, 4, 6, 8, 2, 7, 1],
        [5, 0, 9, 4, 6, 8, 2, 7, 1, 3],
    ];

    let report = 0;

    for (let i = 0; i < code.length; i++) {
        report = table[report][+code[i]];
    }

    return (10 - report) % 10;

}
