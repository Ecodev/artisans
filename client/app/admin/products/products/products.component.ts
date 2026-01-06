import {Component, inject, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {
    AvailableColumn,
    NaturalAbstractList,
    NaturalColumnsPickerComponent,
    NaturalEnumPipe,
    NaturalFileComponent,
    NaturalFixedButtonComponent,
    NaturalIconDirective,
    NaturalSearchComponent,
    NaturalTableButtonComponent,
    TypedMatCellDef,
} from '@ecodev/natural';
import {productsAdmin} from '../../../shared/natural-search/natural-search-facets';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {ProductService} from '../services/product.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {
    MatCell,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
} from '@angular/material/table';
import {AsyncPipe, CurrencyPipe} from '@angular/common';

@Component({
    selector: 'app-products',
    imports: [
        AsyncPipe,
        CurrencyPipe,
        NaturalColumnsPickerComponent,
        NaturalSearchComponent,
        MatTable,
        MatHeaderCellDef,
        MatHeaderRowDef,
        MatColumnDef,
        TypedMatCellDef,
        MatRowDef,
        MatHeaderCell,
        MatCell,
        MatHeaderRow,
        MatRow,
        MatSort,
        MatSortHeader,
        NaturalFileComponent,
        NaturalTableButtonComponent,
        MatTooltip,
        MatIcon,
        NaturalIconDirective,
        MatProgressSpinner,
        MatPaginator,
        NaturalFixedButtonComponent,
        RouterLink,
        NaturalEnumPipe,
    ],
    templateUrl: './products.component.html',
    styleUrl: './products.component.scss',
})
export class ProductsComponent extends NaturalAbstractList<ProductService> implements OnInit {
    protected readonly permissionsService = inject(PermissionsService);

    public override availableColumns: AvailableColumn[] = [
        {id: 'code', label: 'Code'},
        {id: 'image', label: 'Image'},
        {id: 'name', label: 'Nom'},
        {id: 'type', label: 'Type'},
        {id: 'pricePerUnitCHF', label: 'Prix CHF'},
        {id: 'pricePerUnitEUR', label: 'Prix EUR'},
        {id: 'isActive', label: 'Actif'},
    ];

    public constructor() {
        super(inject(ProductService));

        this.naturalSearchFacets = productsAdmin();
    }
}
