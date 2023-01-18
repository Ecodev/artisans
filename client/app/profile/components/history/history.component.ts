import {Component, Injector, OnInit} from '@angular/core';
import {NaturalAbstractList} from '@ecodev/natural';
import {OrderService} from '../../../admin/order/services/order.service';
import {NaturalSearchFacetsService} from '../../../shared/natural-search/natural-search-facets.service';
import {PermissionsService} from '../../../shared/services/permissions.service';

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss'],
})
export class HistoryComponent extends NaturalAbstractList<OrderService> implements OnInit {
    public constructor(
        service: OrderService,
        naturalSearchFacetsService: NaturalSearchFacetsService,
        public readonly permissionsService: PermissionsService,
        injector: Injector,
    ) {
        super(service, injector);
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
