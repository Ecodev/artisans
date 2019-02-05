import { Component, OnDestroy, OnInit } from '@angular/core';
import { BookableService } from '../../../admin/bookables/services/bookable.service';
import { AppDataSource } from '../../../shared/services/data.source';
import { AutoRefetchQueryRef } from '../../../shared/services/abstract-model.service';
import { BookingsQuery, BookingType } from '../../../shared/generated-types';
import { UserService } from '../../../admin/users/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../../../admin/bookings/services/booking.service';

@Component({
    selector: 'app-services',
    templateUrl: './services.component.html',
    styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit, OnDestroy {

    public user;

    public BookableService = BookableService; // template usage
    public runningServicesDS: AppDataSource;
    public pendingApplicationsDS: AppDataSource;

    public runningServices: AutoRefetchQueryRef<BookingsQuery['bookings']>;
    public pendingApplications: AutoRefetchQueryRef<BookingsQuery['bookings']>;

    public servicesColumns = ['name', 'periodicPrice', 'revoke'];
    public applicationsColumns = ['name', 'initialPrice', 'periodicPrice', 'cancel'];

    constructor(private userService: UserService,
                private route: ActivatedRoute,
                private bookingService: BookingService) {
    }

    ngOnInit() {

        this.user = this.route.snapshot.data.user.model;

        this.runningServices = this.userService.getRunningServices(this.user);
        this.pendingApplications = this.userService.getPendingApplications(this.user);

        this.runningServicesDS = new AppDataSource(this.runningServices.valueChanges);
        this.pendingApplicationsDS = new AppDataSource(this.pendingApplications.valueChanges);
    }

    ngOnDestroy() {
        this.runningServices.unsubscribe();
        this.pendingApplications.unsubscribe();
    }

    /**
     * Set end date ?
     */
    public revokeBooking(booking) {
        this.bookingService.flagEndDate(booking.id);
    }

    public canRevoke(booking): boolean {
        return booking.bookables[0].bookingType !== BookingType.mandatory;
    }

    public cancelApplication(booking) {
        this.bookingService.delete([booking]);
    }


    public addApplication(bookable) {
        this.bookingService.createWithBookable(bookable, this.user).subscribe(() => {
        });
    }
}
