import {Component, OnInit} from '@angular/core';
import {AvailableColumn, NaturalAbstractList} from '@ecodev/natural';
import {OrderSortingField, SortingOrder} from '../../../shared/generated-types';
import {NaturalSearchFacetsService} from '../../../shared/natural-search/natural-search-facets.service';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {OrderService} from '../services/order.service';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss'],
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
