import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractDetail } from '../../shared/components/AbstractDetail';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { BookingService } from '../services/booking.service';
import {
    Booking,
    BookingVariables,
    BookingStatus,
    BookingType,
    CreateBooking,
    CreateBookingVariables,
    UpdateBooking,
    UpdateBookingVariables,
} from '../../../shared/generated-types';
import { UserService } from '../../users/services/user.service';
import { BookableService } from '../../bookables/services/bookable.service';

@Component({
    selector: 'app-booking',
    templateUrl: './booking.component.html',
    styleUrls: ['./booking.component.scss'],
})
export class BookingComponent
    extends AbstractDetail<Booking['booking'],
        BookingVariables,
        CreateBooking['createBooking'],
        CreateBookingVariables,
        UpdateBooking['updateBooking'],
        UpdateBookingVariables,
        any> implements OnInit {

    public bookable;
    public statuses;

    constructor(alertService: AlertService,
                public bookingService: BookingService,
                router: Router,
                route: ActivatedRoute,
                public bookableService: BookableService,
                public userService: UserService,
    ) {
        super('booking', bookingService, alertService, router, route);
    }

    ngOnInit() {
        super.ngOnInit();

        this.bookable = this.data.model.bookable;

        // Booked status should never change, so, don't show it in menu. But if we change bookable, it could be again applicable...
        // Let get time to decide
        this.statuses = this.data.status; // .filter((status: IEnum) => status.value !== BookingStatus.booked);
    }

    public endBooking() {
        const endDate = this.form.get('endDate');
        if (endDate) {
            endDate.setValue((new Date).toISOString());
            this.update();
        }
    }

    public isSelfApproved() {
        return this.bookable ? this.bookable.bookingType === BookingType.self_approved : false;
    }

    public isApplication() {
        return this.data.model.status !== BookingStatus.booked || this.bookable && this.bookable.bookingType === BookingType.admin_approved;
    }

}
