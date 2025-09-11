import {Component, inject, Input, OnInit, input} from '@angular/core';
import {
    AvailableColumn,
    NaturalAbstractList,
    NaturalColumnsPickerComponent,
    NaturalEnumPipe,
    NaturalSearchComponent,
    NaturalTableButtonComponent,
} from '@ecodev/natural';
import {CommonModule, DatePipe} from '@angular/common';
import {orderLines} from '../../../shared/natural-search/natural-search-facets';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {OrderLineService} from '../services/order-lines.service';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';

@Component({
    selector: 'app-order-lines',
    imports: [
        CommonModule,
        NaturalSearchComponent,
        NaturalColumnsPickerComponent,
        MatTableModule,
        MatSortModule,
        NaturalTableButtonComponent,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        NaturalEnumPipe,
        DatePipe,
    ],
    templateUrl: './order-lines.component.html',
    styleUrl: './order-lines.component.scss',
})
export class OrderLinesComponent extends NaturalAbstractList<OrderLineService> implements OnInit {
    public readonly permissionsService = inject(PermissionsService);

    public override availableColumns: AvailableColumn[] = [
        {id: 'creationDate', label: 'Date'},
        {id: 'quantity', label: 'Quantité'},
        {id: 'name', label: 'Nom'},
        {id: 'productType', label: 'Type'},
        {id: 'open', label: 'Nom', checked: false, hidden: true},
        {id: 'owner', label: 'Utilisateur'},
        {id: 'balance', label: 'Montant'},
    ];

    public readonly showTotals = input(false);

    /**
     * If true, hides natural search and transcluded components
     */
    public readonly hideHeader = input(false);

    /**
     * If true, hides pagination
     */
    public readonly hidePaginator = input(false);

    /**
     * Force page size
     */
    @Input() public paginatorPageSize?: number;

    /**
     * Override page size options list
     */
    @Input() public override pageSizeOptions = [5, 25, 50, 100, 200];

    public constructor() {
        super(inject(OrderLineService));

        this.naturalSearchFacets = orderLines();
    }
}
