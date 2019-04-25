import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAbstractList, NaturalAlertService, NaturalPersistenceService } from '@ecodev/natural';
import { TransactionLines, TransactionLinesVariables } from '../../../shared/generated-types';
import { NaturalSearchConfigurationService } from '../../../shared/natural-search/natural-search-configuration.service';
import { PermissionsService } from '../../../shared/services/permissions.service';
import { TransactionLineService } from '../services/transaction-line.service';

@Component({
    selector: 'app-transaction-lines',
    templateUrl: './transaction-lines.component.html',
    styleUrls: ['./transaction-lines.component.scss'],
})
export class TransactionLinesComponent extends NaturalAbstractList<TransactionLines['transactionLines'], TransactionLinesVariables>
    implements OnInit {

    @Input() relativeToAccount;

    @Output() select = new EventEmitter();

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

        this.naturalSearchConfig = naturalSearchConfigurationService.get(this.key);

    }
}
