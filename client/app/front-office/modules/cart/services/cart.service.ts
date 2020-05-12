import { Inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NaturalStorage, SESSION_STORAGE } from '@ecodev/natural';
import { Observable } from 'rxjs';
import { OrderService } from '../../../../admin/order/services/order.service';
import { CreateOrder_createOrder, OrderInput, OrderLineInput, PaymentMethod, ProductType } from '../../../../shared/generated-types';
import { Currency, CurrencyService } from '../../../../shared/services/currency.service';
import { DonationComponent } from '../../../components/donation/donation.component';
import { Cart, CartLineProduct } from '../classes/cart';

@Injectable({
    providedIn: 'root',
})
export class CartService {

    public static _globalCart: Cart;

    constructor(
        private orderService: OrderService,
        private dialogService: MatDialog,
        private currencyService: CurrencyService,
        private snackbar: MatSnackBar,
        private router: Router,
        @Inject(SESSION_STORAGE) private readonly sessionStorage: NaturalStorage,
    ) {

        // If our cart changes in another browser tab, reload it from storage to keep it in sync
        // fromEvent<StorageEvent>(window, 'storage').pipe(
        //     map(event => {
        //         if (event.key === CartService.globalCartStorageKey && event.newValue !== null) {
        //             CartService.globalCart.setLines(JSON.parse(event.newValue));
        //         }
        //     }),
        // ).subscribe();

        // On currency change, update carts totals
        this.currencyService.current.subscribe(currency => Cart.setCurrency(currency));
    }

    public static get globalCart(): Cart {
        return CartService._globalCart;
    }

    public clearCarts() {
        Cart.clearCarts(this.sessionStorage);
        this.initGlobalCart();
    }

    public initGlobalCart() {
        const persistedCart = Cart.getById(this.sessionStorage, 0);

        if (persistedCart) {
            CartService._globalCart = persistedCart;
        } else {
            CartService._globalCart = new Cart(this.sessionStorage, 0);
        }
    }

    public save(cart: Cart, paymentMethod: PaymentMethod): Observable<CreateOrder_createOrder | null> {
        const isCHF = this.currencyService.current.value === Currency.CHF;
        const orderLines: OrderLineInput[] = cart.productLines.map((line) => {
            return {
                product: line.product.id,
                quantity: line.quantity + '',
                type: line.type,
                isCHF: isCHF,
            };
        });

        if (cart.subscription) {
            orderLines.push({
                subscription: cart.subscription.subscription,
                type: cart.subscription.type,
                quantity: '1',
                additionalEmails: cart.subscription.emails,
                isCHF: isCHF,
            });
        }

        // Add donation if any
        if (cart.donationAmount) {
            orderLines.push({
                quantity: '1',
                type: ProductType.digital,
                isCHF: isCHF,
                pricePerUnit: cart.donationAmount,
            });
        }

        const input: OrderInput = {
            paymentMethod: paymentMethod,
            orderLines: orderLines,
        };

        return this.orderService.create(input);
    }

    /**
     * Prompts the user to manually set the donation amount
     */
    public inputDonation(notify: boolean, cart?: Cart) {

        this.dialogService.open(DonationComponent).afterClosed().subscribe(amount => {
            if (amount != null) {

                if (!cart) {
                    cart = CartService.globalCart;
                }

                cart.setDonation(amount);

                if (notify) {
                    this.notificationCartRedirect();
                }
            }
        });
    }

    /**
     * Add product to cart and show alert for cart redirection
     */
    public addProduct(product: CartLineProduct, type: ProductType, quantiy: number) {
        CartService.globalCart.addProduct(product, type, quantiy);
        this.notificationCartRedirect();
    }

    public notificationCartRedirect() {
        const snackbar = this.snackbar.open('Produit ajouté', 'Voir le panier', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
        });
        snackbar.onAction().subscribe(() => {
            this.router.navigateByUrl('/panier');
        });
    }

}
