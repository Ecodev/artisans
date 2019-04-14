import { HierarchicConfiguration } from '../natural/modules/hierarchic-selector/classes/HierarchicConfiguration';
import { AccountService } from './accounts/services/account.service';
import { AccountType } from '../shared/generated-types';

export const AccountHierarchicConfiguration: HierarchicConfiguration[] = [
    {
        service: AccountService,
        parentsFilters: ['parent'],
        childrenFilters: ['parent'],
        selectableAtKey: 'account',
        isSelectableCallback: (account) => account.type !== AccountType.group
    },
];

