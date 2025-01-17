import {Product, ProductType} from '../../../../shared/generated-types';
import {Cart, CartLine} from './cart';
import {CartCollectionService} from '../services/cart-collection.service';
import {memorySessionStorageProvider} from '@ecodev/natural';
import {TestBed} from '@angular/core/testing';

/**
 * Todo : add tests with combinations (same product with web or paper declination)
 */
describe('Cart', () => {
    let cart: Cart;

    const product1 = {
        id: '1',
        pricePerUnitCHF: '10',
    } as unknown as Product['product'];

    const product2 = {
        id: '2',
        pricePerUnitCHF: '100',
    } as unknown as Product['product'];

    const product3 = {
        id: '3',
        pricePerUnitCHF: '1000',
    } as unknown as Product['product'];

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [memorySessionStorageProvider],
        });

        const cartCollectionService = TestBed.inject(CartCollectionService);
        cart = new Cart(cartCollectionService);
    });

    it('should be created', () => {
        expect(cart).toBeTruthy();
    });

    it('should add to cart', () => {
        expect(cart.productLines).withContext('cart to be empty').toEqual([]);

        cart.addProduct(product1, ProductType.Paper, 1);

        const expectedCart = [{product: product1, quantity: 1, totalTaxInc: 10, type: ProductType.Paper}] as CartLine[];

        expect(cart.productLines).withContext('cart have one product').toEqual(expectedCart);
    });

    it('should addProduct quantity for existing product into cart', () => {
        cart.addProduct(product1, ProductType.Paper, 1);
        cart.addProduct(product1, ProductType.Paper, 1);

        const expectedCart = [{product: product1, quantity: 2, totalTaxInc: 20, type: ProductType.Paper}] as CartLine[];

        expect(cart.productLines).withContext('cart have one product').toEqual(expectedCart);
        expect(cart.totalTaxInc).toEqual(20);
    });

    it('should add two different products to cart', () => {
        cart.addProduct(product1, ProductType.Paper, 1);
        cart.addProduct(product2, ProductType.Paper, 1);

        const expectedCart = [
            {product: product1, quantity: 1, totalTaxInc: 10, type: ProductType.Paper},
            {product: product2, quantity: 1, totalTaxInc: 100, type: ProductType.Paper},
        ] as CartLine[];

        expect(cart.productLines).toEqual(expectedCart);
        expect(cart.totalTaxInc).toEqual(110);
    });

    it('should add more than one unit to cart', () => {
        cart.addProduct(product1, ProductType.Paper, 2);

        const expectedCart = [{product: product1, quantity: 2, totalTaxInc: 20, type: ProductType.Paper}] as CartLine[];

        expect(cart.productLines).toEqual(expectedCart);
        expect(cart.totalTaxInc).toEqual(20);
    });

    it('should add decimals quantity', () => {
        cart.addProduct(product3, ProductType.Paper, 0.5);

        const expectedCart = [
            {product: product3, quantity: 0.5, totalTaxInc: 500, type: ProductType.Paper},
        ] as CartLine[];

        expect(cart.productLines).toEqual(expectedCart);
        expect(cart.totalTaxInc).toEqual(500);
    });

    it('should add product decimals quantity to existing products in cart', () => {
        cart.addProduct(product3, ProductType.Paper, 0.5);
        cart.addProduct(product3, ProductType.Paper, 2.5);

        const expectedCart = [
            {product: product3, quantity: 3, totalTaxInc: 3000, type: ProductType.Paper},
        ] as CartLine[];

        expect(cart.productLines).toEqual(expectedCart);
        expect(cart.totalTaxInc).toEqual(3000);
    });
});
