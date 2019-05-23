import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { PermissionsService } from '../../../shared/services/permissions.service';
import { FormValidators, Literal } from '@ecodev/natural';
import { AnonymousUserService } from './anonymous-user.service';
import { LoginValidatorFn } from '../../../admin/users/services/user.service';
import { CartService } from '../../../shop/services/cart.service';

@Injectable({
    providedIn: 'root',
})
export class NewUserService extends AnonymousUserService {

    constructor(apollo: Apollo,
                router: Router,
                permissionsService: PermissionsService,
                cartService: CartService,
    ) {
        super(apollo, router, permissionsService, cartService);
    }

    protected getDefaultForClient(): Literal {
        return {
            password: '',
        };
    }

    public getFormValidators(): FormValidators {
        return {
            login: [Validators.required, LoginValidatorFn],
            firstName: [Validators.required, Validators.maxLength(100)],
            lastName: [Validators.required, Validators.maxLength(100)],
            email: [Validators.required, Validators.email],
            familyRelationship: [Validators.required],
            birthday: [Validators.required],
            locality: [Validators.required],
            street: [Validators.required],
            postcode: [Validators.required],
        };
    }
}
