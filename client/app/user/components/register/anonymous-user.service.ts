import { Injectable } from '@angular/core';
import { UserService } from '../../../admin/users/services/user.service';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { Literal } from '../../../shared/types';
import { FormValidators } from '../../../shared/services/abstract-model.service';
import { BookingService } from '../../../admin/bookings/services/booking.service';
import { Validators } from '@angular/forms';
import { PermissionsService } from '../../../shared/services/permissions.service';

@Injectable({
    providedIn: 'root',
})
export class AnonymousUserService extends UserService {

    constructor(apollo: Apollo,
                router: Router,
                bookingService: BookingService,
                permissionsService: PermissionsService,
    ) {
        super(apollo, router, bookingService, permissionsService);
    }

    public getDefaultValues(): Literal {
        const values = {
            hasInsurance: false,
            termsAgreement: false,
        };

        return Object.assign(super.getDefaultValues(), values);
    }

    public getFormValidators(): FormValidators {
        return {
            email: [Validators.required, Validators.email],
            hasInsurance: [],
            termsAgreement: [],
        };
    }
}
