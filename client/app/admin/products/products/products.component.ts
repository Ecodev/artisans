import {Component, Injector, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AvailableColumn, NaturalAbstractList} from '@ecodev/natural';
import {NaturalSearchFacetsService} from '../../../shared/natural-search/natural-search-facets.service';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {ProductService} from '../services/product.service';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss'],
})
export class ProductsComponent extends NaturalAbstractList<ProductService> implements OnInit {
    public override availableColumns: AvailableColumn[] = [
        {id: 'code', label: 'Code'},
        {id: 'image', label: 'Image'},
        {id: 'name', label: 'Nom'},
        {id: 'type', label: 'Type'},
        {id: 'pricePerUnitCHF', label: 'Prix CHF'},
        {id: 'pricePerUnitEUR', label: 'Prix EUR'},
        {id: 'isActive', label: 'Actif'},
    ];
    public constructor(
        route: ActivatedRoute,
        productService: ProductService,
        naturalSearchFacetsService: NaturalSearchFacetsService,
        public readonly permissionsService: PermissionsService,
        injector: Injector,
    ) {
        super(productService, injector);

        this.naturalSearchFacets = naturalSearchFacetsService.get('productsAdmin');
    }
}
