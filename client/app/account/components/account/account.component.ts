import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    BookingsQuery,
    BookingType,
    CreateUserMutation,
    CreateUserMutationVariables,
    UpdateUserMutation,
    UpdateUserMutationVariables,
    UserQuery,
    UserQueryVariables,
} from '../../../shared/generated-types';
import { AbstractDetail } from '../../../admin/shared/components/AbstractDetail';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../admin/users/services/user.service';
import { AppDataSource } from '../../../shared/services/data.source';
import { BookableService } from '../../../admin/bookables/services/bookable.service';
import { BookingService } from '../../../admin/bookings/services/booking.service';
import { AutoRefetchQueryRef } from '../../../shared/services/abstract-model.service';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
})
export class AccountComponent extends AbstractDetail<UserQuery['user'],
    UserQueryVariables,
    CreateUserMutation['createUser'],
    CreateUserMutationVariables,
    UpdateUserMutation['updateUser'],
    UpdateUserMutationVariables,
    any> implements OnInit, OnDestroy {

    public BookableService = BookableService; // template usage
    public runningNavigationsDS: AppDataSource;
    public runningServicesDS: AppDataSource;
    public pendingApplicationsDS: AppDataSource;

    public runningNavigations: AutoRefetchQueryRef<BookingsQuery['bookings']>;
    public runningServices: AutoRefetchQueryRef<BookingsQuery['bookings']>;
    public pendingApplications: AutoRefetchQueryRef<BookingsQuery['bookings']>;

    public servicesColumns = ['name', 'periodicPrice', 'revoke'];
    public applicationsColumns = ['name', 'initialPrice', 'periodicPrice', 'cancel'];

    constructor(private userService: UserService,
                alertService: AlertService,
                router: Router,
                route: ActivatedRoute,
                private bookingService: BookingService,
                public bookableService: BookableService) {

        super('user', userService, alertService, router, route);
    }

    ngOnInit() {
        super.ngOnInit();

        this.runningNavigations = this.userService.getRunningNavigations(this.data.model);
        this.runningServices = this.userService.getRunningServices(this.data.model);
        this.pendingApplications = this.userService.getPendingApplications(this.data.model);

        this.runningNavigationsDS = new AppDataSource(this.runningNavigations.valueChanges);
        this.runningServicesDS = new AppDataSource(this.runningServices.valueChanges);
        this.pendingApplicationsDS = new AppDataSource(this.pendingApplications.valueChanges);
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this.runningNavigations.unsubscribe();
        this.runningServices.unsubscribe();
        this.pendingApplications.unsubscribe();
    }

    public addApplication(bookable) {
        console.log('bookable', bookable);
        this.bookingService.createWithBookable(bookable, this.data.model).subscribe((newBooking) => {
            console.log('newBooking', newBooking);
        });
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

}
