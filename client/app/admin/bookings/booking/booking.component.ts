import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractDetail } from '../../shared/components/AbstractDetail';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { BookingService } from '../services/booking.service';
import {
    BookingQuery,
    BookingQueryVariables,
    CreateBookingMutation,
    CreateBookingMutationVariables,
    UpdateBookingMutation,
    UpdateBookingMutationVariables,
} from '../../../shared/generated-types';
import { UserService } from '../../users/services/user.service';
import { BookableService } from '../../bookables/services/bookable.service';

@Component({
    selector: 'app-booking',
    templateUrl: './booking.component.html',
    styleUrls: ['./booking.component.scss'],
})
export class BookingComponent
    extends AbstractDetail<BookingQuery['booking'],
        BookingQueryVariables,
        CreateBookingMutation['createBooking'],
        CreateBookingMutationVariables,
        UpdateBookingMutation['updateBooking'],
        UpdateBookingMutationVariables,
        any> {

    constructor(alertService: AlertService,
                public bookingService: BookingService,
                router: Router,
                route: ActivatedRoute,
                public bookableService: BookableService,
                public userService: UserService,
    ) {
        super('booking', bookingService, alertService, router, route);
    }

    public endBooking() {
        const endDate = this.form.get('endDate');
        if (endDate) {
            endDate.setValue((new Date).toISOString());
            this.update();
        }
    }
}
