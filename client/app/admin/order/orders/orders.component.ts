import {Component, Injector, OnInit} from '@angular/core';
import {NaturalAbstractList} from '@ecodev/natural';
import {Orders, OrderSortingField, OrdersVariables, SortingOrder} from '../../../shared/generated-types';
import {NaturalSearchFacetsService} from '../../../shared/natural-search/natural-search-facets.service';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {OrderService} from '../services/order.service';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent extends NaturalAbstractList<Orders['orders'], OrdersVariables> implements OnInit {
    public defaultSorting = [{field: OrderSortingField.creationDate, order: SortingOrder.DESC}];

    constructor(
        service: OrderService,
        naturalSearchFacetsService: NaturalSearchFacetsService,
        public permissionsService: PermissionsService,
        injector: Injector,
    ) {
        super(service, injector);

        this.naturalSearchFacets = naturalSearchFacetsService.get('orders');
    }
}
