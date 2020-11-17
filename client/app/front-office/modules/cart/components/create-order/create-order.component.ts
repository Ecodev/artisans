import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NaturalAlertService} from '@ecodev/natural';
import {UserService} from '../../../../../admin/users/services/user.service';
import {CreateOrder_createOrder, PaymentMethod} from '../../../../../shared/generated-types';
import {ConfigService, FrontEndConfig} from '../../../../../shared/services/config.service';
import {Currency, CurrencyService} from '../../../../../shared/services/currency.service';
import {NavigationService} from '../../../../services/navigation.service';
import {Cart} from '../../classes/cart';
// @ts-ignore
import * as Datatrans from '../../classes/datatrans-2.0.0-ecodev.js';
import {CartService} from '../../services/cart.service';
import {CartCollectionService} from '../../services/cart-collection.service';

@Component({
    selector: 'app-create-order',
    templateUrl: './create-order.component.html',
    styleUrls: ['./create-order.component.scss'],
})
export class CreateOrderComponent implements OnInit {
    /**
     * Eligible cart for order
     */
    public cart?: Cart;

    /**
     * True if no product is paper. Hides shipment address for virtual only cart.
     */
    public virtualOnly = false;

    /**
     * Step 1 form
     */
    public billingForm!: FormGroup;

    /**
     * Step 2 form
     */
    public shippingForm!: FormGroup;

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
    public showConfirmationMessage = false;

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
        private readonly cartCollectionService: CartCollectionService,
        public navigationService: NavigationService,
    ) {
        configService.get().subscribe(paymentConfig => {
            this.paymentConfig = paymentConfig;
        });
    }

    public ngOnInit(): void {
        const cart = this.cartCollectionService.getById(+this.route.snapshot.params['cartId']);
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
    public updateAddressRequirements(required: boolean, form: FormGroup): void {
        const fields = ['firstName', 'lastName', 'street', 'locality', 'postcode']; // todo : add country
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

        this.cartService.save(this.cart, paymentMethod.value, this.billingForm.getRawValue()).subscribe(order => {
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
            error: (data: {message: string}) => {
                this.alertService.error("Le paiement n'a pas abouti: " + data.message);
            },
            cancel: () => {
                this.alertService.error('Le paiement a été annulé');
            },
        });
    }
}
