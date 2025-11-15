import {Component, inject, OnInit} from '@angular/core';
import {NaturalAbstractList, NaturalEnumPipe, NaturalTableButtonComponent} from '@ecodev/natural';
import {OrderService} from '../../../admin/order/services/order.service';
import {orders} from '../../../shared/natural-search/natural-search-facets';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {RouterOutlet} from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatTooltip} from '@angular/material/tooltip';
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
} from '@angular/material/table';
import {AsyncPipe, CurrencyPipe, DatePipe} from '@angular/common';

@Component({
    selector: 'app-history',
    imports: [
        AsyncPipe,
        CurrencyPipe,
        DatePipe,
        MatTable,
        MatHeaderCellDef,
        MatHeaderRowDef,
        MatColumnDef,
        MatCellDef,
        MatRowDef,
        MatHeaderCell,
        MatCell,
        MatHeaderRow,
        MatRow,
        NaturalTableButtonComponent,
        MatTooltip,
        MatProgressSpinner,
        MatPaginator,
        RouterOutlet,
        NaturalEnumPipe,
    ],
    templateUrl: './history.component.html',
    styleUrl: './history.component.scss',
})
export class HistoryComponent extends NaturalAbstractList<OrderService> implements OnInit {
    protected readonly permissionsService = inject(PermissionsService);

    public constructor() {
        super(inject(OrderService));
        this.columnsForTable = ['creationDate', 'status', 'balance'];

        this.naturalSearchFacets = orders();
    }

    public override ngOnInit(): void {
        this.variablesManager.set('viewer', {
            filter: {groups: [{conditions: [{owner: {in: {values: [this.route.snapshot.data.viewer.id]}}}]}]},
        });

        super.ngOnInit();
    }
}
