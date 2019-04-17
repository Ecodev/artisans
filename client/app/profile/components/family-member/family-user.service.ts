import { Injectable } from '@angular/core';
import { UserService } from '../../../admin/users/services/user.service';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { Literal } from '../../../natural/types/types';
import { BookingService } from '../../../admin/bookings/services/booking.service';
import { PermissionsService } from '../../../shared/services/permissions.service';
import { Relationship } from '../../../shared/generated-types';
import { FormValidators } from '../../../natural/services/abstract-model.service';
import { PricedBookingService } from '../../../admin/bookings/services/PricedBooking.service';

@Injectable({
    providedIn: 'root',
})
export class FamilyUserService extends UserService {

    constructor(apollo: Apollo,
                router: Router,
                bookingService: BookingService,
                permissionsService: PermissionsService,
                pricedBookingService: PricedBookingService,

    ) {
        super(apollo, router, bookingService, permissionsService, pricedBookingService);
    }

    public getDefaultValues(): Literal {
        const values = {
            hasInsurance: false,
            termsAgreement: false,
            familyRelationship: Relationship.partner
        };

        return Object.assign(super.getDefaultValues(), values);
    }

    public getFormValidators(): FormValidators {

        const validators = {
            hasInsurance: [],
            termsAgreement: [],
            locality: [],
            street: [],
            postcode: [],
            country: [],
        };

        return Object.assign(super.getFormValidators(), validators);
    }
}
