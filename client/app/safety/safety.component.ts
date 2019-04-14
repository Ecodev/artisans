import { Component } from '@angular/core';
import { BookingsComponent } from '../admin/bookings/bookings/bookings.component';
import { SafetyBookingService } from './safety-booking.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalSearchConfigurationService } from '../shared/natural-search/natural-search-configuration.service';
import { PermissionsService } from '../shared/services/permissions.service';
import { AlertService } from '../natural/components/../../natural/components/alert/alert.service';
import { PersistenceService } from '../natural/services/persistence.service';

@Component({
    selector: 'app-safety',
    templateUrl: '../admin/bookings/bookings/bookings.component.html',
})
export class SafetyComponent extends BookingsComponent {

    constructor(route: ActivatedRoute,
                router: Router,
                bookingService: SafetyBookingService, // Reason of the override
                alertService: AlertService,
                persistenceService: PersistenceService,
                naturalSearchConfigurationService: NaturalSearchConfigurationService,
                permissionsService: PermissionsService) {

        super(route, router, bookingService, alertService, persistenceService, naturalSearchConfigurationService, permissionsService);
    }

}
