import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractDetail } from '../../shared/components/AbstractDetail';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { BookingService } from '../services/booking.service';
import {
    Booking,
    BookingPartialInput,
    BookingStatus,
    BookingType,
    BookingVariables,
    CreateBooking,
    CreateBookingVariables,
    UpdateBooking,
    UpdateBookingVariables,
} from '../../../shared/generated-types';
import { UserService } from '../../users/services/user.service';
import { BookableService } from '../../bookables/services/bookable.service';
import { MatDialog } from '@angular/material';
import { SelectAdminOnlyModalComponent } from '../../../shared/components/select-admin-only-modal/select-admin-only-modal.component';
import { MatDialogConfig } from '@angular/material/dialog/typings/dialog-config';

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

    public BookingStatus = BookingStatus;

    constructor(alertService: AlertService,
                public bookingService: BookingService,
                router: Router,
                route: ActivatedRoute,
                public bookableService: BookableService,
                public userService: UserService,
                private dialog: MatDialog,
    ) {
        super('booking', bookingService, alertService, router, route);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    public endBooking() {
        this.bookingService.terminateBooking(this.data.model.id).subscribe(() => {
            const endDate = this.form.get('endDate');
            if (endDate) {
                endDate.setValue((new Date).toISOString());
            }
        });
    }

    public isSelfApproved() {
        const bookable = this.form.get('bookable');
        if (bookable) {
            return bookable.value ? bookable.value.bookingType === BookingType.self_approved : false;

        }
    }

    public isApplication() {

        const status = this.form.get('status');
        if (status && status.value !== BookingStatus.booked) {
            return true;
        }

        const bookable = this.form.get('bookable');
        if (bookable && status) {
            return status.value !== BookingStatus.booked ||
                   bookable.value && bookable.value.bookingType === BookingType.admin_approved;
        }
    }

    public isStorage() {
        const bookable = this.form.get('bookable');
        if (bookable) {
            return bookable.value.bookableTags.find(t => t.id === '6008');
        }
    }

    public selectStorage() {

        const options: MatDialogConfig = {
            width: '700px',
        };

        this.dialog.open(SelectAdminOnlyModalComponent, options).afterClosed().subscribe(bookable => {
            if (bookable) {
                const booking: BookingPartialInput = {status: BookingStatus.booked};
                this.bookingService.createWithBookable(bookable, this.data.model.owner, booking).subscribe(() => {
                    this.alertService.info('Le stockage sélectionné a bien été attribué à ' + this.data.model.owner.name);
                    this.userService.invoice(this.data.model.owner).subscribe();
                    const status = this.form.get('status');
                    if (status) {
                        console.log('set as processed');
                        status.setValue(BookingStatus.processed);
                        this.update();
                    }
                });
            }
        });
    }

}
