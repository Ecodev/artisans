import {Component, OnInit} from '@angular/core';
import {NaturalQueryVariablesManager} from '@ecodev/natural';
import {UserService} from '../../../admin/users/services/user.service';
import {
    SortingOrder,
    UserRole,
    Users_users_items,
    UserSortingField,
    UsersVariables,
} from '../../../shared/generated-types';

@Component({
    selector: 'app-session-facilitator-private',
    templateUrl: './session-facilitator-private.component.html',
    styleUrls: ['./session-facilitator-private.component.scss'],
})
export class SessionFacilitatorPrivateComponent implements OnInit {
    public facilitators: Users_users_items[] = [];

    public constructor(public readonly userService: UserService) {}

    public ngOnInit(): void {
        const qvm = new NaturalQueryVariablesManager<UsersVariables>();
        qvm.set('variables', {
            filter: {groups: [{conditions: [{role: {in: {values: [UserRole.facilitator]}}}]}]},
            pagination: {pageSize: 999, pageIndex: 0},
            sorting: [{field: UserSortingField.locality, order: SortingOrder.ASC}],
        });

        this.userService.getAll(qvm).subscribe(result => (this.facilitators = result.items));
    }
}
