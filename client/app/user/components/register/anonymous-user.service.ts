import {Apollo} from 'apollo-angular';
import {Inject, Injectable} from '@angular/core';
import {Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {deliverableEmail, FormAsyncValidators, FormValidators, LOCAL_STORAGE, NaturalStorage} from '@ecodev/natural';
import {UserService} from '../../../admin/users/services/user.service';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {CurrencyService} from '../../../shared/services/currency.service';
import {CartCollectionService} from '../../../front-office/modules/cart/services/cart-collection.service';
import {User_user} from '../../../shared/generated-types';
import {DOCUMENT} from '@angular/common';

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
        @Inject(DOCUMENT) document: Document,
        @Inject(LOCAL_STORAGE) storage: NaturalStorage,
    ) {
        super(apollo, router, permissionsService, currencyService, cartCollectionService, document, storage);
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
