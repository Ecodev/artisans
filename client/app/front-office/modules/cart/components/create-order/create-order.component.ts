import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from '@angular/router';
import {NaturalAlertService, NaturalEnumPipe} from '@ecodev/natural';
import {finalize} from 'rxjs/operators';
import {UserService} from '../../../../../admin/users/services/user.service';
import {CreateOrder, PaymentMethod} from '../../../../../shared/generated-types';
import {Currency, CurrencyService} from '../../../../../shared/services/currency.service';
import {NavigationService} from '../../../../services/navigation.service';
import {Cart} from '../../classes/cart';
import {CartService} from '../../services/cart.service';
import {CartCollectionService} from '../../services/cart-collection.service';
import {DatatransService} from '../../services/datatrans.service';
import {Big} from 'big.js';
import {localConfig} from '../../../../../shared/generated-config';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatButton} from '@angular/material/button';
import {AddressComponent} from '../../../../../shared/components/address/address.component';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {AsyncPipe, CurrencyPipe} from '@angular/common';

@Component({
    selector: 'app-create-order',
    imports: [
        AsyncPipe,
        CurrencyPipe,
        FormsModule,
        ReactiveFormsModule,
        MatRadioGroup,
        MatRadioButton,
        AddressComponent,
        MatButton,
        RouterLink,
        MatCheckbox,
        RouterOutlet,
        NaturalEnumPipe,
    ],
    templateUrl: './create-order.component.html',
    styleUrl: './create-order.component.scss',
})
export class CreateOrderComponent implements OnInit {
    protected readonly cartService = inject(CartService);
    private readonly alertService = inject(NaturalAlertService);
    protected readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    protected readonly userService = inject(UserService);
    protected readonly currencyService = inject(CurrencyService);
    private readonly cartCollectionService = inject(CartCollectionService);
    protected readonly navigationService = inject(NavigationService);
    private readonly datatransService = inject(DatatransService);

    /**
     * Eligible cart for order
     */
    protected cart?: Cart;

    /**
     * Step 1 form
     */
    protected billingForm!: FormGroup;

    /**
     * Step 2 form
     */
    protected shippingForm!: FormGroup;

    /**
     * For template usage
     */
    protected PaymentMethod = PaymentMethod;

    /**
     * If true, cart is hidden and confirmation message is shown.
     * We could use dedicated "empty" component but this way we spare some app weight. We can as well use previous form values.
     */
    protected showConfirmationMessage = false;

    /**
     * True when creating order has been sent
     */
    protected pending = false;

    public ngOnInit(): void {
        const cart = this.cartCollectionService.getById(+this.route.snapshot.params.cartId);
        if (cart) {
            this.cart = cart;

            if (cart.isEmpty()) {
                this.router.navigateByUrl('/panier/0');
            }
        }

        const viewer = this.route.snapshot.data.viewer;

        this.shippingForm = new FormGroup({
            paymentMethod: new FormControl('', [Validators.required]),
            firstName: new FormControl(viewer.firstName, [Validators.required]),
            lastName: new FormControl(viewer.lastName, [Validators.required]),
            street: new FormControl(viewer.street, [Validators.required]),
            locality: new FormControl(viewer.locality, [Validators.required]),
            postcode: new FormControl(viewer.postcode, [Validators.required]),
            country: new FormControl(viewer.country, [Validators.required]),
        });

        this.billingForm = new FormGroup({
            sameAsBilling: new FormControl(true),
            firstName: new FormControl(),
            lastName: new FormControl(),
            street: new FormControl(),
            locality: new FormControl(),
            postcode: new FormControl(),
            country: new FormControl(),
        });
    }

    /**
     * Set shipping address mandatory if "same address" is unchecked
     */
    protected updateAddressRequirements(required: boolean, form: FormGroup): void {
        const fields = ['firstName', 'lastName', 'street', 'locality', 'postcode', 'country'];
        fields.forEach(fieldName => {
            const control = form.get(fieldName);
            if (control) {
                control.setValidators(required ? Validators.required : null);
                control.updateValueAndValidity();
            }
        });
    }

    protected createOrder(): void {
        const paymentMethod = this.shippingForm.get('paymentMethod');
        if (!paymentMethod || !this.cart) {
            return;
        }

        this.pending = true;
        this.cartService
            .save(this.cart, paymentMethod.value, this.billingForm.getRawValue())
            .pipe(finalize(() => (this.pending = false)))
            .subscribe(order => {
                if (!order || !this.cart) {
                    return;
                }

                // For datatrans, we ask for payment immediately
                if (paymentMethod.value === PaymentMethod.Datatrans) {
                    this.datatrans(order, this.cart.totalTaxInc, this.currencyService.current.value);
                } else {
                    this.confirmationRedirect();
                }
            });
    }

    protected confirmationRedirect(): void {
        this.cart?.empty();
        this.showConfirmationMessage = true;
        this.navigationService.scrollToTop();
    }

    private datatrans(order: NonNullable<CreateOrder['createOrder']>, amount: number, currency: Currency): void {
        // Convert the decimal amount in cents
        const roundedAmount = Big(amount).times(100).toFixed(0);

        this.datatransService.startPayment({
            params: {
                production: localConfig.datatrans.production,
                merchantId: localConfig.datatrans.merchantId,
                refno: order.id,
                amount: roundedAmount,
                currency: currency,
                endpoint: localConfig.datatrans.endpoint,
            },
            success: () => {
                this.confirmationRedirect();
                this.alertService.info('Paiement réussi');
            },
            error: data => {
                this.alertService.error("Le paiement n'a pas abouti: " + data.message);
            },
            cancel: () => {
                this.alertService.error('Le paiement a été annulé');
            },
        });
    }
}
