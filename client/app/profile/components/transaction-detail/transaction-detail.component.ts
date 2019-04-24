import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAbstractList, NaturalAlertService, NaturalPersistenceService } from '@ecodev/natural';
import { TransactionLineService } from '../../../admin/transactions/services/transactionLine.service';
import { TransactionLines, TransactionLinesVariables } from '../../../shared/generated-types';
import { PermissionsService } from '../../../shared/services/permissions.service';

@Component({
    selector: 'app-order-detail',
    templateUrl: './transaction-detail.component.html',
    styleUrls: ['./transaction-detail.component.scss'],
})
export class TransactionDetailComponent extends NaturalAbstractList<TransactionLines['transactionLines'], TransactionLinesVariables>
    implements OnInit {

    @Input() relativeToAccount;

    public selectedColumns = ['name', 'remarks', 'balance'];
    public persistSearch = false;

    public transaction;

    constructor(route: ActivatedRoute,
                router: Router,
                transactionLineService: TransactionLineService,
                alertService: NaturalAlertService,
                persistenceService: NaturalPersistenceService,
                public permissionsService: PermissionsService,
                @Inject(MAT_DIALOG_DATA) public data: any,
    ) {

        super('transactionLines',
            transactionLineService,
            router,
            route,
            alertService,
            persistenceService,
        );

        // Could be done by a resolver...
        const transactionId = data.routeSnapshot.params.transactionId;
        this.contextVariables = {
            filter: {groups: [{conditions: [{transaction: {equal: {value: transactionId}}}]}]},
        } as TransactionLinesVariables;

        this.transaction = data.routeSnapshot.data.transaction.model;

    }

}
