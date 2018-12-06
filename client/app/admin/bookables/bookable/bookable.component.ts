import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractDetail } from '../../shared/components/AbstractDetail';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { BookableService } from '../services/bookable.service';
import {
    CreateBookableMutation,
    CreateBookableMutationVariables,
    BookableQuery,
    BookableQueryVariables,
    UpdateBookableMutation,
    UpdateBookableMutationVariables,
} from '../../../shared/generated-types';
import { LicenseService } from '../../licenses/services/license.service';

@Component({
    selector: 'app-resurce',
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
                public tagService: LicenseService
    ) {
        super('bookable', bookableService, alertService, router, route);
    }
}
