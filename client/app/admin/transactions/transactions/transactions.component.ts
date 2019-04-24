import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAlertService } from '@ecodev/natural';
import { NaturalPersistenceService } from '@ecodev/natural';
import { NaturalSearchConfigurationService } from '../../../shared/natural-search/natural-search-configuration.service';
import { NaturalAbstractList } from '@ecodev/natural';
import { Transactions, TransactionsVariables } from '../../../shared/generated-types';
import { PermissionsService } from '../../../shared/services/permissions.service';
import { TransactionService } from '../services/transaction.service';

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent extends NaturalAbstractList<Transactions['transactions'], TransactionsVariables> implements OnInit {

    @Output() select = new EventEmitter();

    constructor(route: ActivatedRoute,
                router: Router,
                service: TransactionService,
                alertService: NaturalAlertService,
                persistenceService: NaturalPersistenceService,
                naturalSearchConfigurationService: NaturalSearchConfigurationService,
                public permissionsService: PermissionsService,
                injector: Injector
    ) {

        super('products',
            service,
            router,
            route,
            alertService,
            persistenceService,
            injector
        );

    }
}
