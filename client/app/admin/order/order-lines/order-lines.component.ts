import {Component, Input, OnInit} from '@angular/core';
import {
    AvailableColumn,
    NaturalAbstractList,
    NaturalSearchComponent,
    NaturalColumnsPickerComponent,
    NaturalTableButtonComponent,
    NaturalEnumPipe,
    NaturalSwissDatePipe,
} from '@ecodev/natural';
import {NaturalSearchFacetsService} from '../../../shared/natural-search/natural-search-facets.service';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {OrderLineService} from '../services/order-lines.service';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {ExtendedModule} from '@ngbracket/ngx-layout/extended';
import {FlexModule} from '@ngbracket/ngx-layout/flex';
import {NgIf, AsyncPipe, CurrencyPipe} from '@angular/common';

@Component({
    selector: 'app-order-lines',
    templateUrl: './order-lines.component.html',
    styleUrls: ['./order-lines.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        FlexModule,
        ExtendedModule,
        NaturalSearchComponent,
        NaturalColumnsPickerComponent,
        MatTableModule,
        MatSortModule,
        NaturalTableButtonComponent,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        AsyncPipe,
        CurrencyPipe,
        NaturalEnumPipe,
        NaturalSwissDatePipe,
    ],
})
export class OrderLinesComponent extends NaturalAbstractList<OrderLineService> implements OnInit {
    public override availableColumns: AvailableColumn[] = [
        {id: 'creationDate', label: 'Date'},
        {id: 'quantity', label: 'Quantité'},
        {id: 'name', label: 'Nom'},
        {id: 'productType', label: 'Type'},
        {id: 'open', label: 'Nom', checked: false, hidden: true},
        {id: 'owner', label: 'Utilisateur'},
        {id: 'balance', label: 'Montant'},
    ];

    @Input() public showTotals = false;

    /**
     * If true, hides natural search and transcluded components
     */
    @Input() public hideHeader = false;

    /**
     * If true, hides pagination
     */
    @Input() public hidePaginator = false;

    /**
     * Force page size
     */
    @Input() public paginatorPageSize?: number;

    /**
     * Override page size options list
     */
    @Input() public override pageSizeOptions = [5, 25, 50, 100, 200];

    public constructor(
        service: OrderLineService,
        naturalSearchFacetsService: NaturalSearchFacetsService,
        public readonly permissionsService: PermissionsService,
    ) {
        super(service);

        this.naturalSearchFacets = naturalSearchFacetsService.get('orderLines');
    }
}
