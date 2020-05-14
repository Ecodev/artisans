import { Component, OnInit } from '@angular/core';
import { NaturalQueryVariablesManager } from '@ecodev/natural';
import { UserService } from '../../../admin/users/services/user.service';
import { SortingOrder, UserRole, Users_users_items, UserSortingField, UsersVariables } from '../../../shared/generated-types';

@Component({
    selector: 'app-session-facilitator',
    templateUrl: './session-facilitator.component.html',
    styleUrls: ['./session-facilitator.component.scss'],
})
export class SessionFacilitatorComponent implements OnInit {

    public facilitators: Users_users_items[] = [];

    constructor(public userService: UserService) {
    }

    ngOnInit(): void {
        const qvm = new NaturalQueryVariablesManager<UsersVariables>();
        qvm.set('variables', {
            filter: {groups: [{conditions: [{role: {in: {values: [UserRole.facilitator]}}}]}]},
            pagination: {pageSize: 999, pageIndex: 0},
            sorting: [{field: UserSortingField.locality, order: SortingOrder.ASC}],
        });

        this.userService.getAll(qvm).subscribe((result) => {
            this.facilitators = result.items;
        });
    }

}
