import { Component, Injector, OnInit } from '@angular/core';
import { NaturalAbstractList } from '@ecodev/natural';
import { StockMovements, StockMovementsVariables } from '../../../shared/generated-types';
import { NaturalSearchFacetsService } from '../../../shared/natural-search/natural-search-facets.service';
import { PermissionsService } from '../../../shared/services/permissions.service';
import { StockMovementService } from '../services/stockMovement.service';

@Component({
    selector: 'app-stock-movements',
    templateUrl: './stockMovements.component.html',
    styleUrls: ['./stockMovements.component.scss'],
})
export class StockMovementsComponent extends NaturalAbstractList<StockMovements['stockMovements'], StockMovementsVariables>
    implements OnInit {

    public initialColumns = [
        'creationDate',
        'owner',
        'type',
        'delta',
        'quantity',
        'product',
        'remarks',
    ];

    constructor(stockMovementService: StockMovementService,
                injector: Injector,
                naturalSearchFacetsService: NaturalSearchFacetsService,
                public permissionsService: PermissionsService,
    ) {

        super(stockMovementService, injector);

        this.naturalSearchFacets = naturalSearchFacetsService.get('stockMovements');
    }
}
