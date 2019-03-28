import { Component, OnDestroy, OnInit } from '@angular/core';
import { BookableService } from '../../../admin/bookables/services/bookable.service';
import { AppDataSource } from '../../../shared/services/data.source';
import { AutoRefetchQueryRef } from '../../../shared/services/abstract-model.service';
import { BookingsQuery, BookingType } from '../../../shared/generated-types';
import { UserService } from '../../../admin/users/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../../../admin/bookings/services/booking.service';
import { AlertService } from '../../../shared/components/alert/alert.service';

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
    public applicationsColumns = ['name', 'status', 'initialPrice', 'periodicPrice', 'cancel'];

    constructor(private userService: UserService,
                private route: ActivatedRoute,
                private alertService: AlertService,
                private bookingService: BookingService) {
    }

    ngOnInit() {
        this.user = this.route.snapshot.data.user.model;

        this.pendingApplications = this.userService.getPendingApplications(this.user);
        this.pendingApplicationsDS = new AppDataSource(this.pendingApplications.valueChanges);

        this.runningServices = this.userService.getRunningServices(this.user);
        this.runningServicesDS = new AppDataSource(this.runningServices.valueChanges);
    }

    ngOnDestroy() {
        this.runningServices.unsubscribe();
        this.pendingApplications.unsubscribe();
    }

    /**
     * Set end date ?
     */
    public revokeBooking(booking) {
        this.alertService
            .confirm('Résiliation de prestation', 'Voulez-vous résilier définitivement cette prestation ?', 'Confirmer la résiliation')
            .subscribe(confirmed => {
                if (confirmed) {
                    this.bookingService.terminateBooking(booking.id);
                }
            });
    }

    public canRevoke(booking): boolean {
        return booking.bookables[0].bookingType !== BookingType.mandatory;
    }

    public cancelApplication(booking) {
        this.bookingService.delete([booking]);
    }

    public unregister(): void {
        this.alertService.confirm('Démission', 'Voulez-vous quitter le club Ichtus ?', 'Démissioner définitivement')
            .subscribe(confirmed => {
                if (confirmed) {
                    this.userService.unregister(this.user).subscribe(() => {
                        this.alertService.info('Vous avez démissioné', 5000);
                        this.userService.logout();
                    });
                }
            });
    }
}
