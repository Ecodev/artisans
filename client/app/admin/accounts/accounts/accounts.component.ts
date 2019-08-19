import { Component, Injector, OnInit } from '@angular/core';
import { NaturalAbstractNavigableList } from '@ecodev/natural';
import { Accounts, AccountsVariables } from '../../../shared/generated-types';
import { NaturalSearchFacetsService } from '../../../shared/natural-search/natural-search-facets.service';
import { PermissionsService } from '../../../shared/services/permissions.service';
import { TransactionLineService } from '../../transactions/services/transaction-line.service';
import { AccountService } from '../services/account.service';

@Component({
    selector: 'app-accounts',
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.scss'],
})
export class AccountsComponent extends NaturalAbstractNavigableList<Accounts['accounts'], AccountsVariables> implements OnInit {

    public initialColumns = [
        'navigation',
        'code',
        'name',
        'type',
        'owner',
        'balance',
    ];

    constructor(accountService: AccountService,
                injector: Injector,
                naturalSearchFacetsService: NaturalSearchFacetsService,
                public permissionsService: PermissionsService,
                public transactionLineService: TransactionLineService,
    ) {

        super(accountService, injector);
        this.naturalSearchFacets = naturalSearchFacetsService.get('accounts');
    }

    public addLink(): any[] {
        let route: any[] = ['/admin/account/new'];
        const parentId = this.route.snapshot.params['parent'];
        if (parentId) {
            route = route.concat([{parent: parentId}]);
        }
        return route;
    }

}
