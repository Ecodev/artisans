import {Component, OnInit, inject} from '@angular/core';
import {
    AvailableColumn,
    NaturalAbstractList,
    NaturalAvatarComponent,
    NaturalColumnsPickerComponent,
    NaturalEnumPipe,
    NaturalSearchComponent,
    NaturalTableButtonComponent,
} from '@ecodev/natural';
import {CommonModule, DatePipe} from '@angular/common';
import {OrderSortingField, SortingOrder} from '../../../shared/generated-types';
import {orders} from '../../../shared/natural-search/natural-search-facets';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {OrderService} from '../services/order.service';
import {RouterOutlet} from '@angular/router';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';

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
        DatePipe,
    ],
})
export class OrdersComponent extends NaturalAbstractList<OrderService> implements OnInit {
    public readonly permissionsService = inject(PermissionsService);

    public override defaultSorting = [{field: OrderSortingField.creationDate, order: SortingOrder.DESC}];
    public override availableColumns: AvailableColumn[] = [
        {id: 'creationDate', label: 'Date'},
        {id: 'owner', label: 'Utilisateur'},
        {id: 'lines', label: 'Entrées'},
        {id: 'status', label: 'Statut'},
        {id: 'balanceCHF', label: 'Total CHF'},
        {id: 'balanceEUR', label: 'Total EUR'},
    ];

    public constructor() {
        super(inject(OrderService));

        this.naturalSearchFacets = orders();
    }
}
