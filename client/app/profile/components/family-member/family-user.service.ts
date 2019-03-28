import { Injectable } from '@angular/core';
import { UserService } from '../../../admin/users/services/user.service';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { Literal } from '../../../shared/types';
import { FormValidators } from '../../../shared/services/abstract-model.service';
import { BookingService } from '../../../admin/bookings/services/booking.service';
import { PermissionsService } from '../../../shared/services/permissions.service';
import { Relationship } from '../../../shared/generated-types';

@Injectable({
    providedIn: 'root',
})
export class FamilyUserService extends UserService {

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
