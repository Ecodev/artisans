import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractList } from '../../shared/components/AbstractList';
import { BookingsQuery, BookingsQueryVariables } from '../../../shared/generated-types';
import { BookingService } from '../services/booking.service';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { PersistenceService } from '../../shared/services/persistence.service';
import { NaturalSearchConfigurationService } from '../../../shared/natural-search/natural-search-configuration.service';
import { PermissionsService } from '../../../shared/services/permissions.service';

@Component({
    selector: 'app-bookings',
    templateUrl: './bookings.component.html',
    styleUrls: ['./bookings.component.scss'],
})
export class BookingsComponent extends AbstractList<BookingsQuery['bookings'], BookingsQueryVariables> implements OnInit {

    constructor(route: ActivatedRoute,
                router: Router,
                public bookingService: BookingService,
                alertService: AlertService,
                persistenceService: PersistenceService,
                naturalSearchConfigurationService: NaturalSearchConfigurationService,
                public permissionsService: PermissionsService,
    ) {

        super('bookings',
            bookingService,
            router,
            route,
            alertService,
            persistenceService,
            naturalSearchConfigurationService,
        );
    }
}
