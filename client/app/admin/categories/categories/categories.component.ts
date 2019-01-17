import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { PersistenceService } from '../../shared/services/persistence.service';
import { NaturalSearchConfigurationService } from '../../../shared/natural-search/natural-search-configuration.service';
import { CategoriesQuery, CategoriesQueryVariables } from '../../../shared/generated-types';
import { CategoryService } from '../services/category.service';
import { AbstractNavigableList } from '../../shared/components/AbstractNavigableList';

@Component({
    selector: 'app-bookable-tags',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent extends AbstractNavigableList<CategoriesQuery['categories'], CategoriesQueryVariables> implements OnInit {

    constructor(route: ActivatedRoute,
                router: Router,
                categoryService: CategoryService,
                alertService: AlertService,
                persistenceService: PersistenceService,
                naturalSearchConfigurationService: NaturalSearchConfigurationService) {

        super('categories',
            categoryService,
            router,
            route,
            alertService,
            persistenceService,
            naturalSearchConfigurationService,
        );

    }
}
