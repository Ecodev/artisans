import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAlertService } from '@ecodev/natural';
import { NaturalPersistenceService } from '@ecodev/natural';
import { NaturalSearchConfigurationService } from '../../../shared/natural-search/natural-search-configuration.service';
import { NaturalAbstractList } from '@ecodev/natural';
import { StockMovements, StockMovementsVariables } from '../../../shared/generated-types';
import { StockMovementService } from '../services/stockMovement.service';
import { PermissionsService } from '../../../shared/services/permissions.service';

@Component({
    selector: 'app-stock-movements',
    templateUrl: './stockMovements.component.html',
    styleUrls: ['./stockMovements.component.scss'],
})
export class StockMovementsComponent extends NaturalAbstractList<StockMovements['stockMovements'], StockMovementsVariables>
    implements OnInit {

    constructor(route: ActivatedRoute,
                router: Router,
                stockMovementService: StockMovementService,
                alertService: NaturalAlertService,
                persistenceService: NaturalPersistenceService,
                naturalSearchConfigurationService: NaturalSearchConfigurationService,
                public permissionsService: PermissionsService,
    ) {

        super(stockMovementService,
            router,
            route,
            alertService,
            persistenceService,
        );

        this.naturalSearchConfig = naturalSearchConfigurationService.get('stockMovements');
    }
}
