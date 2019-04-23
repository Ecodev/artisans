import { TestBed } from '@angular/core/testing';

import { CartLine, CartService } from './cart.service';

fdescribe('CartService', () => {

    let priceSetups: [string, string, number, number, number, number][];

    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: CartService = TestBed.get(CartService);
        expect(service).toBeTruthy();
    });

    it('should compute prices', () => {

        priceSetups = [
            ['100.00', '2.5', 1, 100, 2.5, 102.5],
            ['100.00', '2.5', 2, 200, 5, 205],
            ['100.00', '2.5', 3, 300, 7.5, 307.5],
        ];

        priceSetups.forEach(data => {
            const product = {pricePerUnit: data[0], vatRate: data[1]} as CartLine['product'];
            const ht = CartService.getPriceTaxExc(product, data[2]);
            const tax = CartService.getTax(product, data[2]);
            const ttc = CartService.getPriceTaxInc(product, data[2]);
            expect(ht).toEqual(data[3], 'Failed HT' + JSON.stringify(data));
            expect(tax).toEqual(data[4], 'Failed TAX' + JSON.stringify(data));
            expect(ttc).toEqual(data[5], 'Failed TTC' + JSON.stringify(data));
        });

    });

    it('should multiply decimals', () => {
        // [input : numb1, input : numb2, ouput : result]
        const datas = [
            [1, 2, 2],
            [10, 2, 20],
            [0.3999, 100, 39.99], // basic multiplication returns 0.39899..9999995
            [0.39999, 100, 39.999],
            [0.1, 0.2, 0.02], // basic multiplication returns 0.0200..004
        ];

        datas.forEach(data => {
            expect(CartService.multiplyDecimal(data[0], data[1])).toEqual(data[2]);
        });

    });

    it('should count decimals', () => {

        const IOs = [
            [0, 0],
            [1, 0],
            [1.0000000, 0],
            [1.23456, 5],
            [1.999, 3],
            [1.0001, 4],
            [1.10000, 1],
            [-0, 0],
            [-1, 0],
            [-1.0000000, 0],
            [-1.23456, 5],
            [-1.999, 3],
        ];

        IOs.forEach(io => {
            expect(CartService.decimalCount(io[0])).toEqual(io[1]);
        });

    });

});
