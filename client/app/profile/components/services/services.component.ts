import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { BookableService } from '../../../admin/bookables/services/bookable.service';
import { BookingType } from '../../../shared/generated-types';
import { UserService } from '../../../admin/users/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../../../admin/bookings/services/booking.service';
import { AbstractController } from '../../../shared/components/AbstractController';
import { NaturalDataSource } from '../../../natural/classes/DataSource';
import { AlertService } from '../../../natural/components/alert/alert.service';

@Component({
    selector: 'app-services',
    templateUrl: './services.component.html',
    styleUrls: ['./services.component.scss'],
})
export class ServicesComponent extends AbstractController implements OnInit, OnChanges, OnDestroy {

    @Input() user;

    public adminMode = false;

    public BookableService = BookableService;
    public runningServicesDS: NaturalDataSource;
    public pendingApplicationsDS: NaturalDataSource;

    public servicesColumns = ['name', 'periodicPrice', 'revoke'];
    public applicationsColumns = ['name', 'status', 'initialPrice', 'periodicPrice', 'cancel'];

    constructor(private userService: UserService,
                private route: ActivatedRoute,
                private alertService: AlertService,
                private bookingService: BookingService) {
        super();
    }

    ngOnInit() {
        if (!this.user) {
            this.user = this.route.snapshot.data.viewer.model;
        } else {
            this.adminMode = true;
            this.applicationsColumns.push('admin');
            this.servicesColumns.push('usage');
            this.servicesColumns.push('admin');
        }

        this.loadData();
    }

    ngOnChanges(changes: SimpleChanges) {
        const currentUser = changes.user.currentValue;
        if (currentUser.id !== this.user.id) {
            this.loadData();
        }
    }

    public loadData() {
        const pendingApplications = this.userService.getPendingApplications(this.user, this.ngUnsubscribe);
        this.pendingApplicationsDS = new NaturalDataSource(pendingApplications);

        const runningServices = this.userService.getRunningServices(this.user, this.ngUnsubscribe);
        this.runningServicesDS = new NaturalDataSource(runningServices);
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
        return booking.bookable.bookingType !== BookingType.mandatory;
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
