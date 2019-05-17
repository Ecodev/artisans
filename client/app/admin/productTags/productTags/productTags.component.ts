import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAlertService } from '@ecodev/natural';
import { NaturalPersistenceService } from '@ecodev/natural';
import { NaturalSearchConfigurationService } from '../../../shared/natural-search/natural-search-configuration.service';
import { NaturalAbstractList } from '@ecodev/natural';
import { ProductTags, ProductTagsVariables } from '../../../shared/generated-types';
import { ProductTagService } from '../services/productTag.service';
import { PermissionsService } from '../../../shared/services/permissions.service';

@Component({
    selector: 'app-product-tags',
    templateUrl: './productTags.component.html',
    styleUrls: ['./productTags.component.scss'],
})
export class ProductTagsComponent extends NaturalAbstractList<ProductTags['productTags'], ProductTagsVariables> implements OnInit {

    constructor(route: ActivatedRoute,
                router: Router,
                productTagService: ProductTagService,
                alertService: NaturalAlertService,
                persistenceService: NaturalPersistenceService,
                naturalSearchConfigurationService: NaturalSearchConfigurationService,
                public permissionsService: PermissionsService,
    ) {

        super(productTagService,
            router,
            route,
            alertService,
            persistenceService,

        );

    }
}
