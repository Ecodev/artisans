import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAbstractList, NaturalAlertService, NaturalPersistenceService } from '@ecodev/natural';
import { TransactionLines, TransactionLinesVariables } from '../../../shared/generated-types';
import { PermissionsService } from '../../../shared/services/permissions.service';
import { TransactionLineService } from '../services/transactionLine.service';

@Component({
    selector: 'app-transaction-lines',
    templateUrl: './transaction-lines.component.html',
    styleUrls: ['./transaction-lines.component.scss'],
})
export class TransactionLinesComponent extends NaturalAbstractList<TransactionLines['transactionLines'], TransactionLinesVariables>
    implements OnInit {

    @Input() relativeToAccount;

    constructor(route: ActivatedRoute,
                router: Router,
                transactionLineService: TransactionLineService,
                alertService: NaturalAlertService,
                persistenceService: NaturalPersistenceService,
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
