import { calculateSuggestedPrice, mod10Recursive, moneyRoundUp } from './utils';

describe('calculateSuggestedPrice', () => {

    it('should suggest correct price', () => {
        expect(calculateSuggestedPrice('2.00', '0.2', '0.077')).toBe(2.5848);
    });

});

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

describe('Recursive Modulo 10', () => {

    it('should return checksum digit', () => {

        const datas: [string, number][] = [
            ['04', 2],
            ['010000394975', 3],
            ['313947143000901', 8],
            ['80082600000000000000000001', 2],
            ['80082600000000000000000002', 8],
            ['80082600000000000000000003', 3],
            ['80082600000000000000000004', 9],
            ['80082600000000000000000005', 7],
            ['80082600000000000000000006', 5],
            ['80082600000000000000000007', 0],
            ['80082600000000000000000008', 1],
            ['80082600000000000000000009', 6],
            ['80082600000000000000000010', 8],
            ['80082600000000000000000201', 6],
        ];

        datas.forEach(data => {
            expect(mod10Recursive(data[0])).toBe(data[1], data[0]);
        });
    });

});
