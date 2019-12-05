import { TestBed } from '@angular/core/testing';
import { NaturalAlertService } from '@ecodev/natural';
import { OrderService } from '../../../order/services/order.service';
import { Product } from '../../../shared/generated-types';
import { CartLine, CartService } from './cart.service';

class DummyService {
    info() {
    }
}

describe('CartService', () => {

    let service: CartService;

    const product1 = {
        id: '1',
        pricePerUnitCHF: '10',
        unit: '',
    } as unknown as unknown as Product['product'];

    const product2 = {
        id: '2',
        pricePerUnitCHF: '100',
        unit: '',
    } as unknown as Product['product'];

    const product3 = {
        id: '3',
        pricePerUnitCHF: '1000',
        unit: 'kg',
    } as unknown as Product['product'];

    beforeEach(() => {
        localStorage.removeItem('artisans-cart');
        TestBed.configureTestingModule({
            providers: [
                {provide: OrderService, useClass: DummyService},
                {provide: NaturalAlertService, useClass: DummyService},
            ],
        });
        service = TestBed.get(CartService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should add to cart', () => {
        expect(service.cart).toEqual([], 'cart to be empty');

        service.add(product1, 1);

        const expectedCart = [
            {product: product1, quantity: 1, total: 10},
        ] as CartLine[];

        expect(service.cart).toEqual(expectedCart, 'cart have one product');
    });

    it('should increase quantity for existing product into cart', () => {
        service.add(product1, 1);
        service.add(product1, 1);

        const expectedCart = [
            {product: product1, quantity: 2, total: 20},
        ] as CartLine[];
        expect(service.cart).toEqual(expectedCart, 'cart have one product');
        expect(CartService.totalTaxInc).toEqual(20);
    });

    it('should add two different products to cart', () => {
        service.add(product1, 1);
        service.add(product2, 1);

        const expectedCart = [
            {product: product1, quantity: 1, total: 10},
            {product: product2, quantity: 1, total: 100},
        ] as CartLine[];
        expect(service.cart).toEqual(expectedCart);
        expect(CartService.totalTaxInc).toEqual(110);
    });

    it('should update existing product in cart', () => {
        service.add(product1, 1);
        service.add(product2, 1);

        const expectedCart = [
            {product: product1, quantity: 1, total: 10},
            {product: product2, quantity: 1, total: 100},
        ] as CartLine[];
        expect(service.cart).toEqual(expectedCart);
        expect(CartService.totalTaxInc).toEqual(110);

        service.updateProduct(1, 5);
        const expectedCart2 = [
            {product: product1, quantity: 1, total: 10},
            {product: product2, quantity: 5, total: 500},
        ] as CartLine[];
        expect(service.cart).toEqual(expectedCart2);
        expect(CartService.totalTaxInc).toEqual(510);
    });

    it('should add more than one unit to cart', () => {
        service.add(product1, 2);

        const expectedCart = [
            {product: product1, quantity: 2, total: 20},
        ] as CartLine[];
        expect(service.cart).toEqual(expectedCart);
        expect(CartService.totalTaxInc).toEqual(20);
    });

    it('should add decimals quantity', () => {
        service.add(product3, 0.5);

        const expectedCart = [
            {product: product3, quantity: 0.5, total: 500},
        ] as CartLine[];
        expect(service.cart).toEqual(expectedCart);
        expect(CartService.totalTaxInc).toEqual(500);
    });

    it('should increase decimals quantity to existing products in cart', () => {
        service.add(product3, 0.5);
        service.add(product3, 2.5);

        const expectedCart = [
            {product: product3, quantity: 3, total: 3000},
        ] as CartLine[];
        expect(service.cart).toEqual(expectedCart);
        expect(CartService.totalTaxInc).toEqual(3000);
    });

});
