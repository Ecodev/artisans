import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookableService } from '../../admin/bookables/services/bookable.service';
import { BookingService } from '../../admin/bookings/services/booking.service';
import { UserService } from '../../admin/users/services/user.service';
import { AbstractController } from '../../shared/components/AbstractController';
import { Bookings } from '../../shared/generated-types';

@Component({
    selector: 'app-bookable',
    templateUrl: './bookable.component.html',
    styleUrls: ['./bookable.component.scss'],
})
export class BookableComponent extends AbstractController implements OnInit {

    public hasLicense: boolean;
    public isAvailable: boolean;
    public canAccessAdmin: boolean;
    public runningBooking: Bookings['bookings']['items'][0] | null;

    public bookable;

    constructor(private bookableService: BookableService,
                private route: ActivatedRoute,
                public bookingService: BookingService,
                private userService: UserService,
    ) {
        super();
    }

    ngOnInit() {
        this.route.data.subscribe(data => {
            this.bookable = data.bookable.model;
            if (this.bookable) {
                this.initForBookable();
            }
        });

    }

    private initForBookable() {
        this.canAccessAdmin = UserService.canAccessAdmin(this.userService.getCachedCurrentUser());
        this.hasLicense = BookableService.isLicenseGranted(this.bookable, this.userService.getCachedCurrentUser());
        this.bookableService.getAvailability(this.bookable).subscribe(availability => {
            this.isAvailable = availability !== null && availability.isAvailable;
            this.runningBooking = availability !== null ? availability.result.items[0] : null;
        });
    }

    public endBooking() {

        if (this.runningBooking) {
            this.bookingService.terminateBooking(this.runningBooking.id).subscribe(() => {
                this.initForBookable();
            });
        }
    }
}
