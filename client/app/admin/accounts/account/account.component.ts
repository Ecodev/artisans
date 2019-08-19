import { Component, Injector, OnInit } from '@angular/core';
import { NaturalAbstractDetail } from '@ecodev/natural';
import {
    Account,
    AccountVariables,
    CreateAccount,
    CreateAccountVariables,
    UpdateAccount,
    UpdateAccountVariables,
} from '../../../shared/generated-types';
import { groupAccountHierarchicConfiguration } from '../../../shared/hierarchic-selector/GroupAccountHierarchicConfiguration';
import { UserService } from '../../users/services/user.service';
import { AccountService } from '../services/account.service';

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

    constructor(public accountService: AccountService,
                injector: Injector,
                public userService: UserService,
    ) {
        super('account', accountService, injector);
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
