import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormValidators, Literal } from '@ecodev/natural';
import { Apollo } from 'apollo-angular';
import { UserService } from '../../../admin/users/services/user.service';
import { PermissionsService } from '../../../shared/services/permissions.service';
import { CurrencyService } from '../../../shared/services/currency.service';
import { CartService } from '../../../front-office/modules/cart/services/cart.service';

@Injectable({
    providedIn: 'root',
})
export class AnonymousUserService extends UserService {

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
            email: [Validators.required, Validators.email],
            // termsAgreement: [], // todo : restore ?
        };
    }

    protected getDefaultForClient(): Literal {
        return {
            // termsAgreement: false, // todo : restore ?
        };
    }
}
