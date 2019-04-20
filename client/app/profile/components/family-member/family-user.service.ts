import { Injectable } from '@angular/core';
import { UserService } from '../../../admin/users/services/user.service';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { BookingService } from '../../../admin/bookings/services/booking.service';
import { PermissionsService } from '../../../shared/services/permissions.service';
import { Relationship } from '../../../shared/generated-types';
import { FormValidators } from '@ecodev/natural';
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

    protected getDefaultForClient() {
        return {
            country: {id: 1, name: 'Suisse'},
            hasInsurance: false,
            termsAgreement: false,
            familyRelationship: Relationship.partner,
        };
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
