import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAbstractNavigableList, NaturalAlertService, NaturalPersistenceService } from '@ecodev/natural';
import { Accounts, AccountsVariables } from '../../../shared/generated-types';
import { NaturalSearchConfigurationService } from '../../../shared/natural-search/natural-search-configuration.service';
import { PermissionsService } from '../../../shared/services/permissions.service';
import { AccountService } from '../services/account.service';

@Component({
    selector: 'app-accounts',
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.scss'],
})
export class AccountsComponent extends NaturalAbstractNavigableList<Accounts['accounts'], AccountsVariables> implements OnInit {

    constructor(route: ActivatedRoute,
                router: Router,
                accountService: AccountService,
                alertService: NaturalAlertService,
                persistenceService: NaturalPersistenceService,
                naturalSearchConfigurationService: NaturalSearchConfigurationService,
                public permissionsService: PermissionsService,
    ) {

        super(accountService,
            router,
            route,
            alertService,
            persistenceService,
        );

    }
}
