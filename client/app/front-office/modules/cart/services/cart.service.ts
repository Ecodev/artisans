import {inject, Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {Literal} from '@ecodev/natural';
import {Observable} from 'rxjs';
import {OrderService} from '../../../../admin/order/services/order.service';
import {CreateOrder, OrderInput, OrderLineInput, PaymentMethod, ProductType} from '../../../../shared/generated-types';
import {Currency, CurrencyService} from '../../../../shared/services/currency.service';
import {DonationComponent, DonationData} from '../../../components/donation/donation.component';
import {Cart, CartLineProduct} from '../classes/cart';
import {GlobalCartService} from './global-cart.service';
import {CartCollectionService} from './cart-collection.service';

@Injectable({
    providedIn: 'root',
})
export class CartService {
    private readonly orderService = inject(OrderService);
    private readonly dialogService = inject(MatDialog);
    private readonly currencyService = inject(CurrencyService);
    private readonly snackbar = inject(MatSnackBar);
    private readonly router = inject(Router);
    private readonly globalCartService = inject(GlobalCartService);
    private readonly cartCollectionService = inject(CartCollectionService);

    public constructor() {
        // On currency change, update carts totals
        this.currencyService.current.subscribe(currency => (this.cartCollectionService.currency = currency));
    }

    public save(
        cart: Cart,
        paymentMethod: PaymentMethod,
        billingAddress: Literal,
    ): Observable<CreateOrder['createOrder'] | null> {
        const isCHF = this.currencyService.current.value === Currency.CHF;
        const orderLines: OrderLineInput[] = cart.productLines.map(line => {
            return {
                product: line.product.id,
                quantity: line.quantity,
                type: line.type,
                isCHF: isCHF,
            };
        });

        if (cart.subscription) {
            orderLines.push({
                subscription: cart.subscription.subscription,
                type: cart.subscription.type,
                quantity: 1,
                additionalEmails: cart.subscription.emails,
                isCHF: isCHF,
            });
        }

        // Add donation if any
        if (cart.donationAmount) {
            orderLines.push({
                quantity: 1,
                type: ProductType.digital,
                isCHF: isCHF,
                pricePerUnit: cart.donationAmount.toFixed(2),
            });
        }

        const input: OrderInput = {
            paymentMethod: paymentMethod,
            orderLines: orderLines,
            firstName: billingAddress.firstName ?? '',
            lastName: billingAddress.lastName ?? '',
            street: billingAddress.street ?? '',
            locality: billingAddress.locality ?? '',
            postcode: billingAddress.postcode ?? '',
            country: billingAddress.country?.id ?? null,
        };

        return this.orderService.create(input);
    }

    /**
     * Prompts the user to manually set the donation amount
     */
    public inputDonation(notify: boolean, cart?: Cart): void {
        this.dialogService
            .open<DonationComponent, DonationData, number | null>(DonationComponent, {
                data: {
                    amount: cart?.donationAmount ?? null,
                },
            })
            .afterClosed()
            .subscribe(amount => {
                if (amount != null) {
                    if (!cart) {
                        cart = this.globalCartService.cart;
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
    public addProduct(product: CartLineProduct, type: ProductType, quantiy: number): void {
        this.globalCartService.cart.addProduct(product, type, quantiy);
        this.notificationCartRedirect();
    }

    public notificationCartRedirect(): void {
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
