import {Apollo} from 'apollo-angular';
import {Inject, Injectable} from '@angular/core';
import {Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {deliverableEmail, FormValidators, Literal, LOCAL_STORAGE, NaturalStorage} from '@ecodev/natural';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {AnonymousUserService} from './anonymous-user.service';
import {CurrencyService} from '../../../shared/services/currency.service';
import {CartCollectionService} from '../../../front-office/modules/cart/services/cart-collection.service';
import {DOCUMENT} from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class NewUserService extends AnonymousUserService {
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
