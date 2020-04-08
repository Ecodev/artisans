import { Currency } from '../../../../shared/services/currency.service';
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
        cart = new Cart(sessionStorage);
        // Ensure that we always test in CHF
        Cart.setCurrency(Currency.CHF);
    });

    it('should be created', () => {
        expect(cart).toBeTruthy();
    });

    it('should add to cart', () => {
        expect(cart.productLines).toEqual([], 'cart to be empty');

        cart.addProduct(product1, ProductType.paper, 1);

        const expectedCart = [
            {product: product1, quantity: 1, totalTaxInc: 10, type: ProductType.paper},
        ] as CartLine[];

        expect(cart.productLines).toEqual(expectedCart, 'cart have one product');
    });

    it('should addProduct quantity for existing product into cart', () => {
        cart.addProduct(product1, ProductType.paper, 1);
        cart.addProduct(product1, ProductType.paper, 1);

        const expectedCart = [
            {product: product1, quantity: 2, totalTaxInc: 20, type: ProductType.paper},
        ] as CartLine[];

        expect(cart.productLines).toEqual(expectedCart, 'cart have one product');
        expect(cart.totalTaxInc).toEqual(20);
    });

    it('should add two different products to cart', () => {
        cart.addProduct(product1, ProductType.paper, 1);
        cart.addProduct(product2, ProductType.paper, 1);

        const expectedCart = [
            {product: product1, quantity: 1, totalTaxInc: 10, type: ProductType.paper},
            {product: product2, quantity: 1, totalTaxInc: 100, type: ProductType.paper},
        ] as CartLine[];

        expect(cart.productLines).toEqual(expectedCart);
        expect(cart.totalTaxInc).toEqual(110);
    });

    it('should update existing product in cart', () => {
        cart.addProduct(product1, ProductType.paper, 1);
        cart.addProduct(product2, ProductType.paper, 1);

        const expectedCart = [
            {product: product1, quantity: 1, totalTaxInc: 10, type: ProductType.paper},
            {product: product2, quantity: 1, totalTaxInc: 100, type: ProductType.paper},
        ] as CartLine[];

        expect(cart.productLines).toEqual(expectedCart);
        expect(cart.totalTaxInc).toEqual(110);
    });

    it('should add more than one unit to cart', () => {
        cart.addProduct(product1, ProductType.paper, 2);

        const expectedCart = [
            {product: product1, quantity: 2, totalTaxInc: 20, type: ProductType.paper},
        ] as CartLine[];

        expect(cart.productLines).toEqual(expectedCart);
        expect(cart.totalTaxInc).toEqual(20);
    });

    it('should add decimals quantity', () => {
        cart.addProduct(product3, ProductType.paper, 0.5);

        const expectedCart = [
            {product: product3, quantity: 0.5, totalTaxInc: 500, type: ProductType.paper},
        ] as CartLine[];

        expect(cart.productLines).toEqual(expectedCart);
        expect(cart.totalTaxInc).toEqual(500);
    });

    it('should addProduct decimals quantity to existing products in cart', () => {
        cart.addProduct(product3, ProductType.paper, 0.5);
        cart.addProduct(product3, ProductType.paper, 2.5);

        const expectedCart = [
            {product: product3, quantity: 3, totalTaxInc: 3000, type: ProductType.paper},
        ] as CartLine[];

        expect(cart.productLines).toEqual(expectedCart);
        expect(cart.totalTaxInc).toEqual(3000);
    });

});
