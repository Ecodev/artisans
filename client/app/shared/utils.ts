import Big from 'big.js';

export function moneyRoundUp(amount: number): number {
    return Math.ceil(+Big(amount).times(100)) / 100;
}

/**
 * Copy text to clipboard.
 * Accepts line breaks \n as textarea do.
 */
export function copy(document: Document, value: string): void {
    const input = document.createElement('textarea');
    document.body.append(input);
    input.value = value;
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
}
