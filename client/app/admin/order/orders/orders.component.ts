import {Component, inject, OnInit} from '@angular/core';
import {
    AvailableColumn,
    NaturalAbstractList,
    NaturalAvatarComponent,
    NaturalColumnsPickerComponent,
    NaturalEnumPipe,
    NaturalSearchComponent,
    NaturalTableButtonComponent,
    TypedMatCellDef,
} from '@ecodev/natural';
import {AsyncPipe, CurrencyPipe, DatePipe} from '@angular/common';
import {OrderSortingField, SortingOrder} from '../../../shared/generated-types';
import {orders} from '../../../shared/natural-search/natural-search-facets';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {OrderService} from '../services/order.service';
import {RouterOutlet} from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatTooltip} from '@angular/material/tooltip';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {
    MatCell,
    MatColumnDef,
    MatFooterCell,
    MatFooterCellDef,
    MatFooterRow,
    MatFooterRowDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
} from '@angular/material/table';

@Component({
    selector: 'app-orders',
    imports: [
        AsyncPipe,
        CurrencyPipe,
        DatePipe,
        NaturalColumnsPickerComponent,
        NaturalSearchComponent,
        MatTable,
        MatHeaderCellDef,
        MatHeaderRowDef,
        MatColumnDef,
        TypedMatCellDef,
        MatRowDef,
        MatFooterCellDef,
        MatFooterRowDef,
        MatHeaderCell,
        MatCell,
        MatFooterCell,
        MatHeaderRow,
        MatRow,
        MatFooterRow,
        MatSort,
        MatSortHeader,
        NaturalAvatarComponent,
        NaturalTableButtonComponent,
        MatTooltip,
        MatProgressSpinner,
        MatPaginator,
        RouterOutlet,
        NaturalEnumPipe,
    ],
    templateUrl: './orders.component.html',
    styleUrl: './orders.component.scss',
})
export class OrdersComponent extends NaturalAbstractList<OrderService> implements OnInit {
    protected readonly permissionsService = inject(PermissionsService);

    public override defaultSorting = [{field: OrderSortingField.creationDate, order: SortingOrder.DESC}];
    public override availableColumns: AvailableColumn[] = [
        {id: 'creationDate', label: 'Date'},
        {id: 'owner', label: 'Utilisateur'},
        {id: 'lines', label: 'Entrées'},
        {id: 'status', label: 'État'},
        {id: 'balanceCHF', label: 'Total CHF'},
        {id: 'balanceEUR', label: 'Total EUR'},
    ];

    public constructor() {
        super(inject(OrderService));

        this.naturalSearchFacets = orders();
    }
}
