import {Apollo} from 'apollo-angular';
import {Injectable} from '@angular/core';
import {Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {deliverableEmail, FormValidators, Literal} from '@ecodev/natural';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {AnonymousUserService} from './anonymous-user.service';
import {CurrencyService} from '../../../shared/services/currency.service';
import {CartService} from '../../../front-office/modules/cart/services/cart.service';

@Injectable({
    providedIn: 'root',
})
export class NewUserService extends AnonymousUserService {
    constructor(
        apollo: Apollo,
        router: Router,
        permissionsService: PermissionsService,
        currencyService: CurrencyService,
        cartService: CartService,
    ) {
        super(apollo, router, permissionsService, currencyService, cartService);
    }

    public getFormValidators(): FormValidators {
        return {
            firstName: [Validators.required, Validators.maxLength(100)],
            lastName: [Validators.required, Validators.maxLength(100)],
            email: [Validators.required, deliverableEmail],
            locality: [Validators.required],
            street: [Validators.required],
            postcode: [Validators.required],
            country: [Validators.required],
        };
    }

    protected getDefaultForClient(): Literal {
        return {
            password: '',
        };
    }
}
