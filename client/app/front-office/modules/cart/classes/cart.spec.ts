import { Product, ProductType } from '../../../../shared/generated-types';
import { CartService } from '../services/cart.service';
import { Cart, CartLine } from './cart';

/**
 * Todo : add tests with combinations (same product with web or paper declination)
 */
describe('CartService', () => {

    let cart: Cart;

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
        cart = new Cart();
    });

    it('should be created', () => {
        expect(cart).toBeTruthy();
    });

    it('should add to cart', () => {
        expect(cart.lines).toEqual([], 'cart to be empty');

        cart.increase(product1, ProductType.paper, 1);

        const expectedCart = [
            {product: product1, quantity: 1, totalTaxInc: 10, type: ProductType.paper},
        ] as CartLine[];

        expect(cart.lines).toEqual(expectedCart, 'cart have one product');
    });

    it('should increase quantity for existing product into cart', () => {
        cart.increase(product1, ProductType.paper, 1);
        cart.increase(product1, ProductType.paper, 1);

        const expectedCart = [
            {product: product1, quantity: 2, totalTaxInc: 20, type: ProductType.paper},
        ] as CartLine[];

        expect(cart.lines).toEqual(expectedCart, 'cart have one product');
        expect(cart.totalTaxInc).toEqual(20);
    });

    it('should add two different products to cart', () => {
        cart.increase(product1, ProductType.paper, 1);
        cart.increase(product2, ProductType.paper, 1);

        const expectedCart = [
            {product: product1, quantity: 1, totalTaxInc: 10, type: ProductType.paper},
            {product: product2, quantity: 1, totalTaxInc: 100, type: ProductType.paper},
        ] as CartLine[];

        expect(cart.lines).toEqual(expectedCart);
        expect(cart.totalTaxInc).toEqual(110);
    });

    it('should update existing product in cart', () => {
        cart.increase(product1, ProductType.paper, 1);
        cart.increase(product2, ProductType.paper, 1);

        const expectedCart = [
            {product: product1, quantity: 1, totalTaxInc: 10, type: ProductType.paper},
            {product: product2, quantity: 1, totalTaxInc: 100, type: ProductType.paper},
        ] as CartLine[];

        expect(cart.lines).toEqual(expectedCart);
        expect(cart.totalTaxInc).toEqual(110);
    });

    it('should add more than one unit to cart', () => {
        cart.increase(product1, ProductType.paper, 2);

        const expectedCart = [
            {product: product1, quantity: 2, totalTaxInc: 20, type: ProductType.paper},
        ] as CartLine[];

        expect(cart.lines).toEqual(expectedCart);
        expect(cart.totalTaxInc).toEqual(20);
    });

    it('should add decimals quantity', () => {
        cart.increase(product3, ProductType.paper, 0.5);

        const expectedCart = [
            {product: product3, quantity: 0.5, totalTaxInc: 500, type: ProductType.paper},
        ] as CartLine[];

        expect(cart.lines).toEqual(expectedCart);
        expect(cart.totalTaxInc).toEqual(500);
    });

    it('should increase decimals quantity to existing products in cart', () => {
        cart.increase(product3, ProductType.paper, 0.5);
        cart.increase(product3, ProductType.paper, 2.5);

        const expectedCart = [
            {product: product3, quantity: 3, totalTaxInc: 3000, type: ProductType.paper},
        ] as CartLine[];

        expect(cart.lines).toEqual(expectedCart);
        expect(cart.totalTaxInc).toEqual(3000);
    });

});
