import { TestBed } from '@angular/core/testing';
import { NaturalAlertService } from '@ecodev/natural';
import { OrderService } from '../../order/services/order.service';
import { Product } from '../../shared/generated-types';
import { CartLine, CartService } from './cart.service';

class DummyService {
    info() {
    }
}

fdescribe('CartService', () => {

    let service: CartService;

    const product1 = {
        id: '1',
        pricePerUnit: '10',
        ponderatePrice: false,
        unit: '',
    } as Product['product'];

    const product2 = {
        id: '2',
        pricePerUnit: '100',
        ponderatePrice: true,
        unit: '',
    } as Product['product'];

    const product3 = {
        id: '3',
        pricePerUnit: '1000',
        ponderatePrice: false,
        unit: 'kg',
    } as Product['product'];

    beforeEach(() => {
        sessionStorage.removeItem('chez-emmy-cart');
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

        service.add(product1, 1, 1);

        const expectedCart = [
            {product: product1, quantity: 1, pricePonderation: 1, total: 10},
        ] as CartLine[];

        expect(service.cart).toEqual(expectedCart, 'cart have one product');
    });

    it('should increase quantity for existing product into cart', () => {
        service.add(product1, 1, 1);
        service.add(product1, 1, 1);

        const expectedCart = [
            {product: product1, quantity: 2, pricePonderation: 1, total: 20},
        ] as CartLine[];
        expect(service.cart).toEqual(expectedCart, 'cart have one product');
        expect(CartService.totalTaxInc).toEqual(20);
    });

    it('should add two different products to cart', () => {
        service.add(product1, 1, 1);
        service.add(product2, 1, 1);

        const expectedCart = [
            {product: product1, quantity: 1, pricePonderation: 1, total: 10},
            {product: product2, quantity: 1, pricePonderation: 1, total: 100},
        ] as CartLine[];
        expect(service.cart).toEqual(expectedCart);
        expect(CartService.totalTaxInc).toEqual(110);
    });

    it('should update existing product in cart', () => {
        service.add(product1, 1, 1);
        service.add(product2, 1, 1);

        const expectedCart = [
            {product: product1, quantity: 1, pricePonderation: 1, total: 10},
            {product: product2, quantity: 1, pricePonderation: 1, total: 100},
        ] as CartLine[];
        expect(service.cart).toEqual(expectedCart);
        expect(CartService.totalTaxInc).toEqual(110);

        service.updateProduct(1, 5, 0.5);
        const expectedCart2 = [
            {product: product1, quantity: 1, pricePonderation: 1, total: 10},
            {product: product2, quantity: 5, pricePonderation: 0.5, total: 250},
        ] as CartLine[];
        expect(service.cart).toEqual(expectedCart2);
        expect(CartService.totalTaxInc).toEqual(260);
    });

    it('should add more than one unit to cart', () => {
        service.add(product1, 2, 1);

        const expectedCart = [
            {product: product1, quantity: 2, pricePonderation: 1, total: 20},
        ] as CartLine[];
        expect(service.cart).toEqual(expectedCart);
        expect(CartService.totalTaxInc).toEqual(20);
    });

    it('should add decimals quantity', () => {
        service.add(product3, 0.5, 1);

        const expectedCart = [
            {product: product3, quantity: 0.5, pricePonderation: 1, total: 500},
        ] as CartLine[];
        expect(service.cart).toEqual(expectedCart);
        expect(CartService.totalTaxInc).toEqual(500);
    });

    it('should increase decimals quantity to existing products in cart', () => {
        service.add(product3, 0.5, 1);
        service.add(product3, 2.5, 1);

        const expectedCart = [
            {product: product3, quantity: 3, pricePonderation: 1, total: 3000},
        ] as CartLine[];
        expect(service.cart).toEqual(expectedCart);
        expect(CartService.totalTaxInc).toEqual(3000);
    });

    it('should add ponderated priced product to cart', () => {
        service.add(product2, 1, 0.5);

        const expectedCart = [
            {product: product2, quantity: 1, pricePonderation: 0.5, total: 50},
        ] as CartLine[];
        expect(service.cart).toEqual(expectedCart);
        expect(CartService.totalTaxInc).toEqual(50);
    });

    it('should add same product with different ponderated price', () => {
        service.add(product2, 1, 0.5);
        service.add(product2, 1, 0.30);

        const expectedCart = [
            {product: product2, quantity: 1, pricePonderation: 0.5, total: 50},
            {product: product2, quantity: 1, pricePonderation: 0.3, total: 30},
        ] as CartLine[];
        expect(service.cart).toEqual(expectedCart);
        expect(CartService.totalTaxInc).toEqual(80);
    });

    it('should merge same ponderated priced products after edition', () => {
        service.add(product2, 3, 1);
        service.add(product2, 2, 0.50);
        service.add(product2, 1, 0.10);

        const expectedCart = [
            {product: product2, quantity: 3, pricePonderation: 1, total: 300},
            {product: product2, quantity: 2, pricePonderation: 0.5, total: 100},
            {product: product2, quantity: 1, pricePonderation: 0.1, total: 10},
        ] as CartLine[];
        expect(service.cart).toEqual(expectedCart);
        expect(CartService.totalTaxInc).toEqual(410);

        // Change ponderation of first product to the same one as second. Both should be merged and quantity cumulated
        service.updateProduct(0, 3, 0.5);
        const expectedCart2 = [
            {product: product2, quantity: 5, pricePonderation: 0.5, total: 250},
            {product: product2, quantity: 1, pricePonderation: 0.1, total: 10},
        ] as CartLine[];
        expect(service.cart).toEqual(expectedCart2);
        expect(CartService.totalTaxInc).toEqual(260);

        // Change ponderation and quantity
        service.updateProduct(0, 3, 0.1);
        const expectedCart3 = [
            {product: product2, quantity: 4, pricePonderation: 0.1, total: 40},
        ] as CartLine[];
        expect(service.cart).toEqual(expectedCart3);
        expect(CartService.totalTaxInc).toEqual(40);
    });

});
