import { moneyRoundUp } from './utils';

describe('moneyRoundUp', () => {

    it('should not touch rounded sum', () => {
        expect(moneyRoundUp(4.15)).toBe(4.15);
    });

    it('should round up to the next cent', () => {
        expect(moneyRoundUp(2.154)).toBe(2.16);
    });

    it('should not touch rounded sum', () => {
        expect(moneyRoundUp(199.99)).toBe(199.99);
    });

    it('should not touch rounded sum', () => {
        expect(moneyRoundUp(2.95)).toBe(2.95);
    });

    it('should not touch zero amount', () => {
        expect(moneyRoundUp(0)).toBe(0);
    });

});
