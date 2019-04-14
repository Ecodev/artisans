import { Injectable } from '@angular/core';
import { UserService } from '../../../admin/users/services/user.service';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { Literal } from '../../../natural/types/types';
import { Validators } from '@angular/forms';
import { BookingService } from '../../../admin/bookings/services/booking.service';
import { PermissionsService } from '../../../shared/services/permissions.service';
import { FormValidators } from '../../../natural/services/abstract-model.service';

@Injectable({
    providedIn: 'root',
})
export class NewUserService extends UserService {

    constructor(apollo: Apollo,
                router: Router,
                bookingService: BookingService,
                permissionsService: PermissionsService,
    ) {
        super(apollo, router, bookingService, permissionsService);
    }

    public getDefaultValues(): Literal {
        const values = {
            password: '',
            hasInsurance: true, // already accepted on step 1
            termsAgreement: true,  // already accepted on step 1
        };

        return Object.assign(super.getDefaultValues(), values);
    }

    public getFormValidators(): FormValidators {

        const validators = {
            hasInsurance: [],
            termsAgreement: [],
            locality: [Validators.required],
            street: [Validators.required],
            postcode: [Validators.required],
            country: [Validators.required],
        };

        return Object.assign(super.getFormValidators(), validators);
    }
}
