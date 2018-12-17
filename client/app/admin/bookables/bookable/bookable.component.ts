import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractDetail } from '../../shared/components/AbstractDetail';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { BookableService } from '../services/bookable.service';
import {
    BookableQuery,
    BookableQueryVariables,
    CreateBookableMutation,
    CreateBookableMutationVariables,
    UpdateBookableMutation,
    UpdateBookableMutationVariables,
} from '../../../shared/generated-types';
import { LicenseService } from '../../licenses/services/license.service';

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
                public licenseService: LicenseService,
    ) {
        super('bookable', bookableService, alertService, router, route);
    }
}
