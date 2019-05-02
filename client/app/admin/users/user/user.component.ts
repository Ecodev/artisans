import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAbstractDetail, NaturalAlertService, NaturalQueryVariablesManager } from '@ecodev/natural';
import { UserService } from '../services/user.service';
import {
    CreateUser,
    CreateUserVariables,
    LogicalOperator,
    SortingOrder,
    TransactionLineSortingField,
    TransactionLinesVariables,
    UpdateUser,
    UpdateUserVariables,
    User,
    UsersVariables,
    UserVariables,
} from '../../../shared/generated-types';
import { UserTagService } from '../../userTags/services/userTag.service';
import { AccountService } from '../../accounts/services/account.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
})
export class UserComponent
    extends NaturalAbstractDetail<User['user'],
        UserVariables,
        CreateUser['createUser'],
        CreateUserVariables,
        UpdateUser['updateUser'],
        UpdateUserVariables,
        any> implements OnInit {

    public showFamilyTab;
    public UserService = UserService;

    public transactionLinesVariables;
    public familyVariables;

    constructor(alertService: NaturalAlertService,
                private userService: UserService,
                router: Router,
                route: ActivatedRoute,
                public userTagService: UserTagService,
                public accountService: AccountService,
    ) {
        super('user', userService, alertService, router, route);
    }

    ngOnInit() {
        super.ngOnInit();

        this.route.data.subscribe(() => {

            if (this.data.model.id) {
                this.userService.getFamily(this.data.model).subscribe(family => {
                    this.showFamilyTab = family.items.length > 1;
                });

                this.familyVariables = UserService.getFamilyVariables(this.data.model);
                this.transactionLinesVariables = this.getTransactionQueryVariables();
            }

        });

    }

    public getTransactionQueryVariables(): TransactionLinesVariables {
        const account = this.data.model.account;
        if (!account) {
            return {};
        }

        return {
            filter: {
                groups: [
                    {
                        conditionsLogic: LogicalOperator.OR,
                        conditions: [
                            {credit: {equal: {value: account.id}}},
                            {debit: {equal: {value: account.id}}},
                        ],
                    },

                ],
            },
            sorting: [{field: TransactionLineSortingField.transactionDate, order: SortingOrder.DESC}],
        };
    }

}
