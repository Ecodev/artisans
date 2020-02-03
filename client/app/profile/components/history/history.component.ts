import { Component, Injector, OnInit } from '@angular/core';
import { NaturalAbstractList } from '@ecodev/natural';
import { OrderService } from '../../../admin/order/services/order.service';
import { Orders, OrdersVariables } from '../../../shared/generated-types';
import { NaturalSearchFacetsService } from '../../../shared/natural-search/natural-search-facets.service';
import { PermissionsService } from '../../../shared/services/permissions.service';

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss'],
})
export class HistoryComponent extends NaturalAbstractList<Orders['orders'], OrdersVariables> implements OnInit {

    public selectedColumns = ['creationDate', 'status', 'balance'];

    constructor(service: OrderService,
                naturalSearchFacetsService: NaturalSearchFacetsService,
                public permissionsService: PermissionsService,
                injector: Injector,
    ) {

        super(service, injector);

        this.naturalSearchFacets = naturalSearchFacetsService.get('orders');
    }

    ngOnInit(): void {

        this.variablesManager.set('viewer',
            {filter: {groups: [{conditions: [{owner: {in: {values: [this.route.snapshot.data.viewer.model.id]}}}]}]}},
        );

        super.ngOnInit();
    }
}
