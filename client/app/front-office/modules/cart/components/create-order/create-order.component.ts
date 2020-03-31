import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAlertService, NaturalStorage, SESSION_STORAGE } from '@ecodev/natural';
import { UserService } from '../../../../../admin/users/services/user.service';
import { Currency } from '../../../../../shared/classes/currencyManager';
import { CreateOrder_createOrder, PaymentMethod } from '../../../../../shared/generated-types';
import { ConfigService, FrontEndConfig } from '../../../../../shared/services/config.service';
import { Currency, CurrencyService } from '../../../../../shared/services/currency.service';
import { Cart } from '../../classes/cart';
import * as Datatrans from '../../classes/datatrans-2.0.0-ecodev.js';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-create-order',
    templateUrl: './create-order.component.html',
    styleUrls: ['./create-order.component.scss'],
})
export class CreateOrderComponent implements OnInit {

    /**
     * Eligible cart for order
     */
    public cart: Cart;

    /**
     * Selected payment method
     */
    public paymentMethod: PaymentMethod;

    /**
     * True if no product is paper. Hides shipment address for virtual only cart.
     */
    public virtualOnly = false;

    /**
     * Step 1 form
     */
    public billingForm: FormGroup;

    /**
     * Step 2 form
     */
    public shippingForm: FormGroup;

    /**
     * For template usage
     */
    public CartService = CartService;

    /**
     * For template usage
     */
    public PaymentMethod = PaymentMethod;

    /**
     * If true, cart is hidden and confirmation message is shown.
     * We could use dedicated "empty" component but this way we spare some app weight. We can as well use previous form values.
     */
    public showConfirmationMessage: boolean;

    /**
     * Banking payment config
     */
    private paymentConfig: FrontEndConfig | null = null;

    constructor(
        public cartService: CartService,
        public alertService: NaturalAlertService,
        public router: Router,
        private route: ActivatedRoute,
        public userService: UserService,
        configService: ConfigService,
        public currencyService: CurrencyService,
        @Inject(SESSION_STORAGE) private readonly sessionStorage: NaturalStorage,
    ) {
        configService.get().subscribe(paymentConfig => {
            this.paymentConfig = paymentConfig;
        });
    }

    ngOnInit() {

        const cart = Cart.getById(this.sessionStorage, +this.route.snapshot.params['cartId']);
        if (cart) {
            this.cart = cart;

            if (cart.isEmpty()) {
                this.router.navigateByUrl('/panier/0');
            }

            // Not used for now, but we'll maybe need it soon
            // this.virtualOnly = !cart.productLines.some(line => line.type === ProductType.paper || line.type === ProductType.both);
        }

        const viewer = this.route.snapshot.data.viewer.model;

        this.shippingForm = new FormGroup({
            paymentMethod: new FormControl('', [Validators.required]),
            firstName: new FormControl(viewer.firstName, [Validators.required]),
            lastName: new FormControl(viewer.lastName, [Validators.required]),
            street: new FormControl(viewer.street, [Validators.required]),
            locality: new FormControl(viewer.locality, [Validators.required]),
            postcode: new FormControl(viewer.postcode, [Validators.required]),
            country: new FormControl(viewer.country, []), // todo : set mandatory
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
    public updateAddressRequirements(required: boolean, form: FormGroup) {

        const fields = ['firstName', 'lastName', 'street', 'locality', 'postcode']; // todo : add country
        fields.forEach(fieldName => {
            const control = form.get(fieldName);
            if (control) {
                if (required) {
                    control.setValidators([Validators.required]);
                } else {
                    control.clearValidators();
                    control.updateValueAndValidity();
                }
            }
        });
    }

    public createOrder(): void {
        const paymentMethod = this.shippingForm.get('paymentMethod');
        if (!paymentMethod) {
            return;
        }

        this.cartService.save(this.cart, paymentMethod.value).subscribe(order => {

            if (!order) {
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

    public confirmationRedirect() {

        this.cart.empty();
        this.showConfirmationMessage = true;

    }

    private datatrans(order: CreateOrder_createOrder, amount: number, currency: Currency): void {

        if (!this.paymentConfig) {
            return;
        }

        const sign = Datatrans.getHexaSHA256Signature(
            '',
            this.paymentConfig.datatrans.key,
            this.paymentConfig.datatrans.merchantId,
            amount * 100,
            currency,
            order.id,
        );

        Datatrans.startPayment({
            params: {
                production: this.paymentConfig.datatrans.production,
                merchantId: this.paymentConfig.datatrans.merchantId,
                sign: sign,
                refno: order.id,
                amount: amount * 100,
                currency: currency,
                endpoint: this.paymentConfig.datatrans.endpoint,
            },
            success: () => {
                this.confirmationRedirect();
                this.alertService.info('Paiement réussi');
            },
            error: (data) => {
                this.alertService.error('Le paiement n\'a pas abouti: ' + data.message);
            },
            cancel: () => {
                this.alertService.error('Le paiement a été annulé');
            },
        });
    }
}
