import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {
    AvailableColumn,
    NaturalAbstractList,
    NaturalColumnsPickerComponent,
    NaturalSearchComponent,
    NaturalFileComponent,
    NaturalTableButtonComponent,
    NaturalIconDirective,
    NaturalFixedButtonComponent,
    NaturalEnumPipe,
} from '@ecodev/natural';
import {NaturalSearchFacetsService} from '../../../shared/natural-search/natural-search-facets.service';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {ProductService} from '../services/product.service';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {ExtendedModule} from '@ngbracket/ngx-layout/extended';
import {FlexModule} from '@ngbracket/ngx-layout/flex';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FlexModule,
        NaturalColumnsPickerComponent,
        NaturalSearchComponent,
        ExtendedModule,
        MatTableModule,
        MatSortModule,
        NaturalFileComponent,
        NaturalTableButtonComponent,
        MatTooltipModule,
        MatIconModule,
        NaturalIconDirective,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        NaturalFixedButtonComponent,
        RouterLink,
        NaturalEnumPipe,
    ],
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
    ) {
        super(productService);

        this.naturalSearchFacets = naturalSearchFacetsService.get('productsAdmin');
    }
}
