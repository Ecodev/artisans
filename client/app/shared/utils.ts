export function moneyRoundUp(amount: number): number {

    let result = Math.ceil(amount * 100);

    const m = result.toString().match(/.$/);
    if (m) {
        const lastDigit = +m[0];

        if (lastDigit > 0 && lastDigit < 5) {
            result += 5 - lastDigit;
        } else if (lastDigit > 5) {
            result += 10 - lastDigit;
        }
    }

    result = result / 100;

    return result;
}

export function calculateSuggestedPrice(supplierPrice: string, margin: string, vatRate: string): number {
    const priceWithMargin = +supplierPrice + (+supplierPrice * +margin);
    const priceWithTaxes = priceWithMargin + priceWithMargin * +vatRate;

    return priceWithTaxes;
}
