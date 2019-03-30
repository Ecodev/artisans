import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractDetail } from '../../shared/components/AbstractDetail';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { AccountService } from '../services/account.service';
import {
    Account,
    AccountVariables,
    CreateAccount,
    CreateAccountVariables,
    UpdateAccount,
    UpdateAccountVariables,
} from '../../../shared/generated-types';
import { UserService } from '../../users/services/user.service';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
})
export class AccountComponent
    extends AbstractDetail<Account['account'],
        AccountVariables,
        CreateAccount['createAccount'],
        CreateAccountVariables,
        UpdateAccount['updateAccount'],
        UpdateAccountVariables,
        any> {

    constructor(alertService: AlertService,
                accountService: AccountService,
                router: Router,
                route: ActivatedRoute,
                public userService: UserService,
    ) {
        super('account', accountService, alertService, router, route);
    }
}
