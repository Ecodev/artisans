import { HierarchicConfiguration } from '../classes/HierarchicConfiguration';
import { AccountService } from '../../../admin/accounts/services/account.service';
import { AccountType } from '../../generated-types';

export const AccountConfiguration: HierarchicConfiguration[] = [
    {
        service: AccountService,
        parentsFilters: ['parent'],
        childrenFilters: ['parent'],
        selectableAtKey: 'account',
        isSelectableCallback: (account) => account.type !== AccountType.group
    },
];

