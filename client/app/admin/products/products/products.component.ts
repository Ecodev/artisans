import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAbstractList, NaturalAlertService, NaturalPersistenceService } from '@ecodev/natural';
import { Products, ProductsVariables } from '../../../shared/generated-types';
import { NaturalSearchFacetsService } from '../../../shared/natural-search/natural-search-facets.service';
import { PermissionsService } from '../../../shared/services/permissions.service';
import { ProductService } from '../services/product.service';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss'],
})
export class ProductsComponent extends NaturalAbstractList<Products['products'], ProductsVariables> implements OnInit {

    constructor(route: ActivatedRoute,
                router: Router,
                productService: ProductService,
                alertService: NaturalAlertService,
                persistenceService: NaturalPersistenceService,
                naturalSearchFacetsService: NaturalSearchFacetsService,
                public permissionsService: PermissionsService,
                injector: Injector,
    ) {

        super(productService,
            router,
            route,
            alertService,
            persistenceService,
            injector,
        );

        this.naturalSearchFacets = naturalSearchFacetsService.get(route.snapshot.data.isAdmin ? 'productsAdmin' : 'productsFrontend');

    }
}
