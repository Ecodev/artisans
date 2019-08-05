import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NaturalAbstractDetail } from '@ecodev/natural';
import { NaturalAlertService } from '@ecodev/natural';
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
import { groupAccountHierarchicConfiguration } from '../../../shared/hierarchic-selector/GroupAccountHierarchicConfiguration';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
})
export class AccountComponent
    extends NaturalAbstractDetail<Account['account'],
        AccountVariables,
        CreateAccount['createAccount'],
        CreateAccountVariables,
        UpdateAccount['updateAccount'],
        UpdateAccountVariables,
        any> implements OnInit {

    public nextCodeAvailable: number;
    public accountHierarchicConfig = groupAccountHierarchicConfiguration;

    constructor(alertService: NaturalAlertService,
                public accountService: AccountService,
                router: Router,
                route: ActivatedRoute,
                public userService: UserService,
    ) {
        super('account', accountService, alertService, router, route);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.accountService.getNextCodeAvailable().subscribe(code => {
            this.nextCodeAvailable = code;
            if (!this.data.model.id) {
                const codeField = this.form.get('code');
                if (codeField) {
                    codeField.setValue(code);
                }
            }
        });
        const parentId = this.route.snapshot.params['parent'];
        if (parentId) {
            this.accountService.getOne(parentId).subscribe(parentAccount => {
                const parentField = this.form.get('parent');
                if (parentAccount.id && parentField) {
                    parentField.setValue({id: parentAccount.id, name: [parentAccount.code, parentAccount.name].join(' ')});
                }
            });
        }
    }
    public getAccountLabel(account: Account['account']): string {
        if (account) {
            return [account.code, account.name].join(' ');
        }
        return '';
    }
    public updateLinkedFields(): void {
        const typeField = this.form.get('type');
        if (typeField && typeField.value !== 'liability') {
            const ownerField = this.form.get('owner');
            if (ownerField) {
                ownerField.setValue(null);
            }
        }
        if (typeField && typeField.value !== 'asset') {
            const ibanField = this.form.get('iban');
            if (ibanField) {
                ibanField.setValue('');
            }
        }
    }
}
