import {Apollo} from 'apollo-angular';
import {Injectable} from '@angular/core';
import {Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {deliverableEmail, FormValidators, Literal} from '@ecodev/natural';
import {UserService} from '../../../admin/users/services/user.service';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {CurrencyService} from '../../../shared/services/currency.service';
import {CartCollectionService} from '../../../front-office/modules/cart/services/cart-collection.service';

@Injectable({
    providedIn: 'root',
})
export class AnonymousUserService extends UserService {
    constructor(
        apollo: Apollo,
        router: Router,
        permissionsService: PermissionsService,
        currencyService: CurrencyService,
        cartCollectionService: CartCollectionService,
    ) {
        super(apollo, router, permissionsService, currencyService, cartCollectionService);
    }

    public getFormValidators(): FormValidators {
        return {
            email: [Validators.required, deliverableEmail],
            // termsAgreement: [], // todo : restore ?
        };
    }

    protected getDefaultForClient(): Literal {
        return {
            // termsAgreement: false, // todo : restore ?
        };
    }
}
