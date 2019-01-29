import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../admin/users/services/user.service';
import { BookingService } from '../admin/bookings/services/booking.service';
import { AutoRefetchQueryRef } from '../shared/services/abstract-model.service';
import { BookingsQuery } from '../shared/generated-types';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [
        trigger('terminate', [
            state('end', style({transform: 'scale(1, 1)'})),
            transition(':leave', [
                animate('0.4s ease-in-out', style({transform: 'scale(0, 0)'})),
            ]),
        ]),
    ],
})
export class DashboardComponent implements OnInit, OnDestroy {

    public title = 'my-ichtus';

    public currentUser;

    public userRunningBookings;
    public userRunningBookingsQueryRef: AutoRefetchQueryRef<BookingsQuery['bookings']>;

    constructor(public userService: UserService, public bookingService: BookingService) {
    }

    public ngOnInit(): void {
        this.userService.getCurrentUser().subscribe(user => {
            this.currentUser = user;
            this.userRunningBookingsQueryRef = this.userService.getRunningNavigations(user);
            this.userRunningBookingsQueryRef.valueChanges.subscribe(bookings => {
                this.userRunningBookings = bookings.items;
            });
        });

    }

    ngOnDestroy() {
        if (this.userRunningBookingsQueryRef) {
            this.userRunningBookingsQueryRef.unsubscribe();
        }
    }

    public canAccessAdmin() {
        return UserService.canAccessAdmin(this.currentUser);
    }

    public endBooking(booking, index) {
        this.bookingService.flagEndDate(booking.id);
        this.userRunningBookings.splice(index, 1);
    }

}
