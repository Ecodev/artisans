import Big, {BigSource} from 'big.js';

export function moneyRoundUp(amount: BigSource): number {
    return Math.ceil(+Big(amount).times(100)) / 100;
}
