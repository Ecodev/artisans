import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { PersistenceService } from '../../shared/services/persistence.service';
import { NaturalSearchConfigurationService } from '../../../shared/natural-search/natural-search-configuration.service';
import { TransactionTags, TransactionTagsVariables } from '../../../shared/generated-types';
import { TransactionTagService } from '../services/transactionTag.service';
import { PermissionsService } from '../../../shared/services/permissions.service';
import { AbstractList } from '../../shared/components/AbstractList';

@Component({
    selector: 'app-transaction-tags',
    templateUrl: './transactionTags.component.html',
    styleUrls: ['./transactionTags.component.scss'],
})
export class TransactionTagsComponent
    extends AbstractList<TransactionTags['transactionTags'], TransactionTagsVariables>
    implements OnInit {

    constructor(route: ActivatedRoute,
                router: Router,
                transactionTagService: TransactionTagService,
                alertService: AlertService,
                persistenceService: PersistenceService,
                naturalSearchConfigurationService: NaturalSearchConfigurationService,
                public permissionsService: PermissionsService,
    ) {

        super('transactionTags',
            transactionTagService,
            router,
            route,
            alertService,
            persistenceService,
            naturalSearchConfigurationService,
        );

    }
}
