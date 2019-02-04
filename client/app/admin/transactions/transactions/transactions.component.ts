import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { PersistenceService } from '../../shared/services/persistence.service';
import { NaturalSearchConfigurationService } from '../../../shared/natural-search/natural-search-configuration.service';
import { AbstractList } from '../../shared/components/AbstractList';
import { TransactionsQuery, TransactionsQueryVariables } from '../../../shared/generated-types';
import { TransactionService } from '../services/transaction.service';
import { PermissionsService } from '../../../shared/services/permissions.service';

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent extends AbstractList<TransactionsQuery['transactions'], TransactionsQueryVariables> implements OnInit {

    constructor(route: ActivatedRoute,
                router: Router,
                transactionService: TransactionService,
                alertService: AlertService,
                persistenceService: PersistenceService,
                naturalSearchConfigurationService: NaturalSearchConfigurationService,
                public permissionsService: PermissionsService,
    ) {

        super('transactions',
            transactionService,
            router,
            route,
            alertService,
            persistenceService,
            naturalSearchConfigurationService,
        );

    }
}
