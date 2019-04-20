import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAlertService } from '@ecodev/natural';
import { NaturalPersistenceService } from '@ecodev/natural';
import { NaturalSearchConfigurationService } from '../../../shared/natural-search/natural-search-configuration.service';
import { NaturalAbstractList } from '@ecodev/natural';
import { ExpenseClaims, ExpenseClaimsVariables } from '../../../shared/generated-types';
import { ExpenseClaimService } from '../services/expenseClaim.service';
import { PermissionsService } from '../../../shared/services/permissions.service';

@Component({
    selector: 'app-expense-claims',
    templateUrl: './expenseClaims.component.html',
    styleUrls: ['./expenseClaims.component.scss'],
})
export class ExpenseClaimsComponent extends NaturalAbstractList<ExpenseClaims['expenseClaims'], ExpenseClaimsVariables>
    implements OnInit {

    constructor(route: ActivatedRoute,
                router: Router,
                expenseClaimService: ExpenseClaimService,
                alertService: NaturalAlertService,
                persistenceService: NaturalPersistenceService,
                naturalSearchConfigurationService: NaturalSearchConfigurationService,
                public permissionsService: PermissionsService,
    ) {

        super('expenseClaims',
            expenseClaimService,
            router,
            route,
            alertService,
            persistenceService,

        );

    }
}
