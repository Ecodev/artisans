import {Apollo} from 'apollo-angular';
import {Injectable} from '@angular/core';
import {Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {deliverableEmail, FormAsyncValidators, FormValidators} from '@ecodev/natural';
import {UserService} from '../../../admin/users/services/user.service';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {CurrencyService} from '../../../shared/services/currency.service';
import {CartCollectionService} from '../../../front-office/modules/cart/services/cart-collection.service';
import {User_user} from '../../../shared/generated-types';

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
        };
    }

    public getFormAsyncValidators(model: User_user): FormAsyncValidators {
        return {};
    }
}
