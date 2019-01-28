import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractDetail } from '../../shared/components/AbstractDetail';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { BookableService } from '../services/bookable.service';
import {
    BookableQuery,
    BookableQueryVariables,
    BookingType,
    CreateBookableMutation,
    CreateBookableMutationVariables,
    UpdateBookableMutation,
    UpdateBookableMutationVariables,
} from '../../../shared/generated-types';
import { LicenseService } from '../../licenses/services/license.service';
import { BookableTagService } from '../../bookableTags/services/bookableTag.service';

@Component({
    selector: 'app-bookable',
    templateUrl: './bookable.component.html',
    styleUrls: ['./bookable.component.scss'],
})
export class BookableComponent
    extends AbstractDetail<BookableQuery['bookable'],
        BookableQueryVariables,
        CreateBookableMutation['createBookable'],
        CreateBookableMutationVariables,
        UpdateBookableMutation['updateBookable'],
        UpdateBookableMutationVariables,
        any> {

    constructor(alertService: AlertService,
                bookableService: BookableService,
                router: Router,
                route: ActivatedRoute,
                public bookableTagService: BookableTagService,
                public licenseService: LicenseService,
    ) {
        super('bookable', bookableService, alertService, router, route);
    }

    public verify() {

        const partialBookable = {id: this.data.model.id, verificationDate: (new Date()).toISOString()};
        this.service.updatePartially(partialBookable).subscribe((bookable) => {
            this.form.patchValue(bookable);
        });

    }

    public showVerified() {
        return this.data.model.bookingType === BookingType.self_approved;
    }

    /**
     * Only non-self-approved are applicable for pricing. This simplify GUI
     */
    public isBookingPriceApplicable() {
        return this.data.model.bookingType !== BookingType.self_approved;
    }
}
