import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAlertService } from '@ecodev/natural';
import { NaturalPersistenceService } from '@ecodev/natural';
import { NaturalSearchConfigurationService } from '../../../shared/natural-search/natural-search-configuration.service';
import { NaturalAbstractList } from '@ecodev/natural';
import { Products, ProductsVariables } from '../../../shared/generated-types';
import { ProductService } from '../services/product.service';
import { PermissionsService } from '../../../shared/services/permissions.service';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss'],
})
export class ProductsComponent extends NaturalAbstractList<Products['products'], ProductsVariables> implements OnInit {

    @Output() select = new EventEmitter();

    constructor(route: ActivatedRoute,
                router: Router,
                productService: ProductService,
                alertService: NaturalAlertService,
                persistenceService: NaturalPersistenceService,
                naturalSearchConfigurationService: NaturalSearchConfigurationService,
                public permissionsService: PermissionsService,
                injector: Injector
    ) {

        super('products',
            productService,
            router,
            route,
            alertService,
            persistenceService,
            injector
        );

    }
}
