import {Component, OnInit, inject} from '@angular/core';
import {NaturalAbstractList, NaturalEnumPipe, NaturalTableButtonComponent} from '@ecodev/natural';
import {OrderService} from '../../../admin/order/services/order.service';
import {orders} from '../../../shared/natural-search/natural-search-facets.service';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {RouterOutlet} from '@angular/router';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTableModule} from '@angular/material/table';
import {CommonModule, DatePipe} from '@angular/common';

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrl: './history.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        NaturalTableButtonComponent,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        RouterOutlet,
        NaturalEnumPipe,
        DatePipe,
    ],
})
export class HistoryComponent extends NaturalAbstractList<OrderService> implements OnInit {
    public readonly permissionsService = inject(PermissionsService);

    public constructor() {
        const service = inject(OrderService);

        super(service);
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
