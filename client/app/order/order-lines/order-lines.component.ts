import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { NaturalAbstractList } from '@ecodev/natural';
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
    @Input() showTotals = false;

    constructor(service: OrderLineService,
                naturalSearchFacetsService: NaturalSearchFacetsService,
                public permissionsService: PermissionsService,
                injector: Injector,
    ) {

        super(service, injector);

        this.naturalSearchFacets = naturalSearchFacetsService.get('orderLines');

    }
}
