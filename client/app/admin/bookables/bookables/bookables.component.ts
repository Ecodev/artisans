import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../natural/components/alert/alert.service';
import { PersistenceService } from '../../../natural/services/persistence.service';
import { NaturalSearchConfigurationService } from '../../../shared/natural-search/natural-search-configuration.service';
import { AbstractList } from '../../../natural/classes/AbstractList';
import { Bookables, BookablesVariables } from '../../../shared/generated-types';
import { BookableService } from '../services/bookable.service';
import { PermissionsService } from '../../../shared/services/permissions.service';

@Component({
    selector: 'app-bookables',
    templateUrl: './bookables.component.html',
    styleUrls: ['./bookables.component.scss'],
})
export class BookablesComponent extends AbstractList<Bookables['bookables'], BookablesVariables> implements OnInit {

    @Output() select = new EventEmitter();

    constructor(route: ActivatedRoute,
                router: Router,
                bookableService: BookableService,
                alertService: AlertService,
                persistenceService: PersistenceService,
                naturalSearchConfigurationService: NaturalSearchConfigurationService,
                public permissionsService: PermissionsService,
    ) {

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
