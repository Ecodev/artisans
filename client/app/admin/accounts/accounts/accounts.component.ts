import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../natural/components/alert/alert.service';
import { PersistenceService } from '../../../natural/services/persistence.service';
import { NaturalSearchConfigurationService } from '../../../shared/natural-search/natural-search-configuration.service';
import { Accounts, AccountsVariables } from '../../../shared/generated-types';
import { AccountService } from '../services/account.service';
import { PermissionsService } from '../../../shared/services/permissions.service';
import { AbstractNavigableList } from '../../../natural/classes/AbstractNavigableList';

@Component({
    selector: 'app-accounts',
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.scss'],
})
export class AccountsComponent extends AbstractNavigableList<Accounts['accounts'], AccountsVariables> implements OnInit {

    constructor(route: ActivatedRoute,
                router: Router,
                accountService: AccountService,
                alertService: AlertService,
                persistenceService: PersistenceService,
                naturalSearchConfigurationService: NaturalSearchConfigurationService,
                public permissionsService: PermissionsService,
    ) {

        super('accounts',
            accountService,
            router,
            route,
            alertService,
            persistenceService,
            naturalSearchConfigurationService,
        );

    }
}
