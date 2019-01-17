import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractDetail } from '../../shared/components/AbstractDetail';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { AccountService } from '../services/account.service';
import {
    AccountQuery,
    AccountQueryVariables,
    CreateAccountMutation,
    CreateAccountMutationVariables,
    UpdateAccountMutation,
    UpdateAccountMutationVariables,
} from '../../../shared/generated-types';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
})
export class AccountComponent
    extends AbstractDetail<AccountQuery['account'],
        AccountQueryVariables,
        CreateAccountMutation['createAccount'],
        CreateAccountMutationVariables,
        UpdateAccountMutation['updateAccount'],
        UpdateAccountMutationVariables,
        any> {

    constructor(alertService: AlertService,
                accountService: AccountService,
                router: Router,
                route: ActivatedRoute,
    ) {
        super('account', accountService, alertService, router, route);
    }
}
