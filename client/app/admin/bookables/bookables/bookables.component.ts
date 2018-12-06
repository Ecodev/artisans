import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { PersistenceService } from '../../shared/services/persistence.service';
import { NaturalSearchConfigurationService } from '../../../shared/natural-search/natural-search-configuration.service';
import { AbstractList } from '../../shared/components/AbstractList';
import { BookablesQuery, BookablesQueryVariables } from '../../../shared/generated-types';
import { BookableService } from '../services/bookable.service';

@Component({
    selector: 'app-bookables',
    templateUrl: './bookables.component.html',
    styleUrls: ['./bookables.component.scss'],
})
export class BookablesComponent extends AbstractList<BookablesQuery['bookables'], BookablesQueryVariables> implements OnInit {

    constructor(route: ActivatedRoute,
                router: Router,
                bookableService: BookableService,
                alertService: AlertService,
                persistenceService: PersistenceService,
                naturalSearchConfigurationService: NaturalSearchConfigurationService) {

        super('bookables',
            bookableService,
            router,
            route,
            alertService,
            persistenceService,
            naturalSearchConfigurationService,
        );

    }
}
