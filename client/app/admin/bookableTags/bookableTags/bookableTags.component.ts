import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAlertService } from '../../../natural/modules/alert/alert.service';
import { NaturalPersistenceService } from '../../../natural/services/persistence.service';
import { NaturalSearchConfigurationService } from '../../../shared/natural-search/natural-search-configuration.service';
import { NaturalAbstractList } from '../../../natural/classes/abstract-list';
import { BookableTags, BookableTagsVariables } from '../../../shared/generated-types';
import { BookableTagService } from '../services/bookableTag.service';
import { PermissionsService } from '../../../shared/services/permissions.service';

@Component({
    selector: 'app-bookable-tags',
    templateUrl: './bookableTags.component.html',
    styleUrls: ['./bookableTags.component.scss'],
})
export class BookableTagsComponent extends NaturalAbstractList<BookableTags['bookableTags'], BookableTagsVariables> implements OnInit {

    constructor(route: ActivatedRoute,
                router: Router,
                bookableTagService: BookableTagService,
                alertService: NaturalAlertService,
                persistenceService: NaturalPersistenceService,
                naturalSearchConfigurationService: NaturalSearchConfigurationService,
                public permissionsService: PermissionsService,
    ) {

        super('bookableTags',
            bookableTagService,
            router,
            route,
            alertService,
            persistenceService,
            naturalSearchConfigurationService,
        );

    }
}
