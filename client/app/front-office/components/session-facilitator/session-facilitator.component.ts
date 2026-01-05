import {Component, inject, OnInit} from '@angular/core';
import {NaturalQueryVariablesManager} from '@ecodev/natural';
import {UserService} from '../../../admin/users/services/user.service';
import {SortingOrder, UsersQuery, UserSortingField, UsersQueryVariables} from '../../../shared/generated-types';
import {SessionSideColumnComponent} from '../session-side-column/session-side-column.component';

@Component({
    selector: 'app-session-facilitator',
    imports: [SessionSideColumnComponent],
    templateUrl: './session-facilitator.component.html',
    styleUrl: './session-facilitator.component.scss',
})
export class SessionFacilitatorComponent implements OnInit {
    protected readonly userService = inject(UserService);

    protected facilitators: UsersQuery['users']['items'][0][] = [];

    public ngOnInit(): void {
        const qvm = new NaturalQueryVariablesManager<UsersQueryVariables>();
        qvm.set('variables', {
            filter: {groups: [{conditions: [{isPublicFacilitator: {equal: {value: true}}}]}]},
            pagination: {pageSize: 999, pageIndex: 0},
            sorting: [{field: UserSortingField.locality, order: SortingOrder.ASC}],
        });

        this.userService.getAll(qvm).subscribe(result => (this.facilitators = result.items));
    }
}
