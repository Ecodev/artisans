import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAlertService } from '@ecodev/natural';
import { UserService } from '../../../../../admin/users/services/user.service';
import { Currency, CurrencyManager } from '../../../../../shared/classes/currencyManager';
import { CreateOrder_createOrder, ProductType, PaymentMethod } from '../../../../../shared/generated-types';
import { Cart } from '../../classes/cart';
import * as Datatrans from '../../classes/datatrans-2.0.0-ecodev.js';
import { CartService } from '../../services/cart.service';
import { ConfigService, FrontEndConfig } from '../../../../../shared/services/config.service';

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
    public CurrencyManager = CurrencyManager;

    /**
     * For template usage
     */
    public PaymentMethod = PaymentMethod;

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
    ) {
        configService.get().subscribe(paymentConfig => {
            this.paymentConfig = paymentConfig;
        });
    }

    ngOnInit() {

        const cart = Cart.getById(+this.route.snapshot.params['cartId']);
        if (cart) {
            this.cart = cart;
            this.virtualOnly = !cart.productLines.some(line => line.type === ProductType.paper || line.type === ProductType.both);
        }

        const viewer = this.route.snapshot.data.viewer.model;

        this.billingForm = new FormGroup({
            paymentMethod: new FormControl('', [Validators.required]),
            firstName: new FormControl(viewer.firstName, [Validators.required]),
            lastName: new FormControl(viewer.lastName, [Validators.required]),
            street: new FormControl(viewer.street, [Validators.required]),
            locality: new FormControl(viewer.locality, [Validators.required]),
            postcode: new FormControl(viewer.postcode, [Validators.required]),
            country: new FormControl(viewer.country, []), // todo : set mandatory
        });

        this.shippingForm = new FormGroup({
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

    public confirm(): void {
        const paymentMethod = this.billingForm.get('paymentMethod');
        if (!paymentMethod) {
            return;
        }

        this.cartService.save(this.cart, paymentMethod.value).subscribe(order => {
            this.cart.empty();
            if (!order) {
                return;
            }

            // For datatrans, we ask for payment immediately
            if (paymentMethod.value === PaymentMethod.datatrans) {
                this.datatrans(order, this.cart.totalTaxInc, CurrencyManager.current.value);
            } else {
                this.alertService.info('Votre commande a bien été enregistrée');
            }
        });
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
