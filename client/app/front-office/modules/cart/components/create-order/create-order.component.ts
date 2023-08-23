import {Component, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {AddressComponent} from '../../../../../shared/components/address/address.component';
import {MatRadioModule} from '@angular/material/radio';
import {ExtendedModule} from '@ngbracket/ngx-layout/extended';
import {FlexModule} from '@ngbracket/ngx-layout/flex';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-create-order',
    templateUrl: './create-order.component.html',
    styleUrls: ['./create-order.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FlexModule,
        ExtendedModule,
        FormsModule,
        ReactiveFormsModule,
        MatRadioModule,
        AddressComponent,
        MatButtonModule,
        RouterLink,
        MatCheckboxModule,
        RouterOutlet,
        NaturalEnumPipe,
    ],
})
export class CreateOrderComponent implements OnInit {
    /**
     * Eligible cart for order
     */
    public cart?: Cart;

    /**
     * Step 1 form
     */
    public billingForm!: UntypedFormGroup;

    /**
     * Step 2 form
     */
    public shippingForm!: UntypedFormGroup;

    /**
     * For template usage
     */
    public PaymentMethod = PaymentMethod;

    /**
     * If true, cart is hidden and confirmation message is shown.
     * We could use dedicated "empty" component but this way we spare some app weight. We can as well use previous form values.
     */
    public showConfirmationMessage = false;

    /**
     * True when creating order has been sent
     */
    public pending = false;

    public constructor(
        public readonly cartService: CartService,
        public readonly alertService: NaturalAlertService,
        public readonly router: Router,
        private readonly route: ActivatedRoute,
        public readonly userService: UserService,
        public readonly currencyService: CurrencyService,
        private readonly cartCollectionService: CartCollectionService,
        public readonly navigationService: NavigationService,
        private readonly datatransService: DatatransService,
    ) {}

    public ngOnInit(): void {
        const cart = this.cartCollectionService.getById(+this.route.snapshot.params['cartId']);
        if (cart) {
            this.cart = cart;

            if (cart.isEmpty()) {
                this.router.navigateByUrl('/panier/0');
            }
        }

        const viewer = this.route.snapshot.data.viewer.model;

        this.shippingForm = new UntypedFormGroup({
            paymentMethod: new UntypedFormControl('', [Validators.required]),
            firstName: new UntypedFormControl(viewer.firstName, [Validators.required]),
            lastName: new UntypedFormControl(viewer.lastName, [Validators.required]),
            street: new UntypedFormControl(viewer.street, [Validators.required]),
            locality: new UntypedFormControl(viewer.locality, [Validators.required]),
            postcode: new UntypedFormControl(viewer.postcode, [Validators.required]),
            country: new UntypedFormControl(viewer.country, [Validators.required]),
        });

        this.billingForm = new UntypedFormGroup({
            sameAsBilling: new UntypedFormControl(true),
            firstName: new UntypedFormControl(),
            lastName: new UntypedFormControl(),
            street: new UntypedFormControl(),
            locality: new UntypedFormControl(),
            postcode: new UntypedFormControl(),
            country: new UntypedFormControl(),
        });
    }

    /**
     * Set shipping address mandatory if "same address" is unchecked
     */
    public updateAddressRequirements(required: boolean, form: UntypedFormGroup): void {
        const fields = ['firstName', 'lastName', 'street', 'locality', 'postcode', 'country'];
        fields.forEach(fieldName => {
            const control = form.get(fieldName);
            if (control) {
                control.setValidators(required ? Validators.required : null);
                control.updateValueAndValidity();
            }
        });
    }

    public createOrder(): void {
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
                if (paymentMethod.value === PaymentMethod.datatrans) {
                    this.datatrans(order, this.cart.totalTaxInc, this.currencyService.current.value);
                } else {
                    this.confirmationRedirect();
                }
            });
    }

    public confirmationRedirect(): void {
        this.cart?.empty();
        this.showConfirmationMessage = true;
        this.navigationService.scrollToTop();
    }

    private datatrans(order: NonNullable<CreateOrder['createOrder']>, amount: number, currency: Currency): void {
        // Convert the decimal amount in cents
        const roundedAmount = Big(amount).times(100).toFixed(0);

        const sign = this.datatransService.getHexaSHA256Signature(
            '',
            localConfig.datatrans.key,
            localConfig.datatrans.merchantId,
            roundedAmount,
            currency,
            order.id,
        );

        this.datatransService.startPayment({
            params: {
                production: localConfig.datatrans.production,
                merchantId: localConfig.datatrans.merchantId,
                sign: sign,
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
