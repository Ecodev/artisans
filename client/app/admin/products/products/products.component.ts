import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NaturalAbstractList } from '@ecodev/natural';
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

    public initialColumns = [
        'image',
        'name',
        'code',
        'pricePerUnitCHF',
        'pricePerUnitEUR',
    ];

    constructor(route: ActivatedRoute,
                productService: ProductService,
                naturalSearchFacetsService: NaturalSearchFacetsService,
                public permissionsService: PermissionsService,
                injector: Injector,
    ) {

        super(productService, injector);

        this.naturalSearchFacets = naturalSearchFacetsService.get('productsAdmin');
    }

}
