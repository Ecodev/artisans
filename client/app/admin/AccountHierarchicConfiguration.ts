import { AccountService } from './accounts/services/account.service';
import { AccountType } from '../shared/generated-types';
import { NaturalHierarchicConfiguration } from '../natural/modules/hierarchic-selector/classes/hierarchic-configuration';

export const AccountHierarchicConfiguration: NaturalHierarchicConfiguration[] = [
    {
        service: AccountService,
        parentsFilters: ['parent'],
        childrenFilters: ['parent'],
        selectableAtKey: 'account',
        isSelectableCallback: (account) => account.type !== AccountType.group
    },
];

