import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAbstractList, NaturalAlertService, NaturalPersistenceService } from '@ecodev/natural';
import { Orders, OrdersVariables } from '../../shared/generated-types';
import { NaturalSearchFacetsService } from '../../shared/natural-search/natural-search-facets.service';
import { PermissionsService } from '../../shared/services/permissions.service';
import { OrderService } from '../services/order.service';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent extends NaturalAbstractList<Orders['orders'], OrdersVariables> implements OnInit {

    constructor(route: ActivatedRoute,
                router: Router,
                service: OrderService,
                alertService: NaturalAlertService,
                persistenceService: NaturalPersistenceService,
                naturalSearchFacetsService: NaturalSearchFacetsService,
                public permissionsService: PermissionsService,
                injector: Injector,
    ) {

        super(service,
            router,
            route,
            alertService,
            persistenceService,
            injector,
        );

        this.naturalSearchFacets = naturalSearchFacetsService.get('order');

    }
}
