import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAbstractList, NaturalAlertService, NaturalPersistenceService } from '@ecodev/natural';
import { OrderLines, OrderLinesVariables } from '../../shared/generated-types';
import { NaturalSearchFacetsService } from '../../shared/natural-search/natural-search-facets.service';
import { PermissionsService } from '../../shared/services/permissions.service';
import { OrderLineService } from '../services/order-lines.service';

@Component({
    selector: 'app-order-lines',
    templateUrl: './order-lines.component.html',
    styleUrls: ['./order-lines.component.scss'],
})
export class OrderLinesComponent extends NaturalAbstractList<OrderLines['orderLines'], OrderLinesVariables> implements OnInit {

    @Output() select = new EventEmitter();

    constructor(route: ActivatedRoute,
                router: Router,
                service: OrderLineService,
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

        this.naturalSearchFacets = naturalSearchFacetsService.get('orderLines');

    }
}
