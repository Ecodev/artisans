import { calculateSuggestedPrice, moneyRoundUp } from './utils';

describe('calculateSuggestedPrice', () => {

    it('should suggest correct price', () => {
        expect(calculateSuggestedPrice('2.00', '0.2', '0.077')).toBe(2.5848);
    });

});

describe('moneyRoundUp', () => {

    it('should not touch rounded sum', () => {
        expect(moneyRoundUp(2.55)).toBe(2.55);
    });

    it('should not find files in empty object', () => {
        expect(moneyRoundUp(2.154)).toBe(2.20);
    });

    it('should not find files in empty object', () => {
        expect(moneyRoundUp(199.99)).toBe(200);
    });

    it('should not find files in empty object', () => {
        expect(moneyRoundUp(2.95)).toBe(2.95);
    });

    it('should not find files in empty object', () => {
        expect(moneyRoundUp(0)).toBe(0);
    });

});
