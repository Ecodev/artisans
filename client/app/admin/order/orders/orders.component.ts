import {Component, OnInit} from '@angular/core';
import {
    AvailableColumn,
    NaturalAbstractList,
    NaturalColumnsPickerComponent,
    NaturalSearchComponent,
    NaturalAvatarComponent,
    NaturalTableButtonComponent,
    NaturalEnumPipe,
    NaturalSwissDatePipe,
} from '@ecodev/natural';
import {OrderSortingField, SortingOrder} from '../../../shared/generated-types';
import {NaturalSearchFacetsService} from '../../../shared/natural-search/natural-search-facets.service';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {OrderService} from '../services/order.service';
import {RouterOutlet} from '@angular/router';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';

import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrl: './orders.component.scss',
    standalone: true,
    imports: [
        CommonModule,

        NaturalColumnsPickerComponent,
        NaturalSearchComponent,

        MatTableModule,
        MatSortModule,
        NaturalAvatarComponent,
        NaturalTableButtonComponent,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        RouterOutlet,
        NaturalEnumPipe,
        NaturalSwissDatePipe,
    ],
})
export class OrdersComponent extends NaturalAbstractList<OrderService> implements OnInit {
    public override defaultSorting = [{field: OrderSortingField.creationDate, order: SortingOrder.DESC}];
    public override availableColumns: AvailableColumn[] = [
        {id: 'creationDate', label: 'Date'},
        {id: 'owner', label: 'Utilisateur'},
        {id: 'lines', label: 'Entrées'},
        {id: 'status', label: 'Statut'},
        {id: 'balanceCHF', label: 'Total CHF'},
        {id: 'balanceEUR', label: 'Total EUR'},
    ];

    public constructor(
        service: OrderService,
        naturalSearchFacetsService: NaturalSearchFacetsService,
        public readonly permissionsService: PermissionsService,
    ) {
        super(service);

        this.naturalSearchFacets = naturalSearchFacetsService.get('orders');
    }
}
