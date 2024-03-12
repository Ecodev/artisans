import {Component, OnInit} from '@angular/core';
import {NaturalAbstractList, NaturalTableButtonComponent, NaturalEnumPipe, NaturalSwissDatePipe} from '@ecodev/natural';
import {OrderService} from '../../../admin/order/services/order.service';
import {NaturalSearchFacetsService} from '../../../shared/natural-search/natural-search-facets.service';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {RouterOutlet} from '@angular/router';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTableModule} from '@angular/material/table';
import {ExtendedModule} from '@ngbracket/ngx-layout/extended';
import {FlexModule} from '@ngbracket/ngx-layout/flex';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrl: './history.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        FlexModule,
        ExtendedModule,
        MatTableModule,
        NaturalTableButtonComponent,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        RouterOutlet,
        NaturalEnumPipe,
        NaturalSwissDatePipe,
    ],
})
export class HistoryComponent extends NaturalAbstractList<OrderService> implements OnInit {
    public constructor(
        service: OrderService,
        naturalSearchFacetsService: NaturalSearchFacetsService,
        public readonly permissionsService: PermissionsService,
    ) {
        super(service);
        this.selectedColumns = ['creationDate', 'status', 'balance'];

        this.naturalSearchFacets = naturalSearchFacetsService.get('orders');
    }

    public override ngOnInit(): void {
        this.variablesManager.set('viewer', {
            filter: {groups: [{conditions: [{owner: {in: {values: [this.route.snapshot.data.viewer.model.id]}}}]}]},
        });

        super.ngOnInit();
    }
}
