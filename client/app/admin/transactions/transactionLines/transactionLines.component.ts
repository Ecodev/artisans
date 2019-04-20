import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAlertService } from '@ecodev/natural';
import { NaturalPersistenceService } from '@ecodev/natural';
import { NaturalSearchConfigurationService } from '../../../shared/natural-search/natural-search-configuration.service';
import { NaturalAbstractList } from '@ecodev/natural';
import { TransactionLines, TransactionLinesVariables } from '../../../shared/generated-types';
import { TransactionLineService } from '../services/transactionLine.service';
import { PermissionsService } from '../../../shared/services/permissions.service';

@Component({
    selector: 'app-transaction-lines',
    templateUrl: './transactionLines.component.html',
    styleUrls: ['./transactionLines.component.scss'],
})
export class TransactionLinesComponent extends NaturalAbstractList<TransactionLines['transactionLines'], TransactionLinesVariables>
    implements OnInit {

    @Input() relativeToAccount;

    constructor(route: ActivatedRoute,
                router: Router,
                transactionLineService: TransactionLineService,
                alertService: NaturalAlertService,
                persistenceService: NaturalPersistenceService,
                naturalSearchConfigurationService: NaturalSearchConfigurationService,
                public permissionsService: PermissionsService,
    ) {

        super('transactionLines',
            transactionLineService,
            router,
            route,
            alertService,
            persistenceService,

        );

    }
}
