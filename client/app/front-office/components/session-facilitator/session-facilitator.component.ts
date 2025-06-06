import {Component, inject, OnInit} from '@angular/core';
import {NaturalQueryVariablesManager} from '@ecodev/natural';
import {UserService} from '../../../admin/users/services/user.service';
import {SortingOrder, Users, UserSortingField, UsersVariables} from '../../../shared/generated-types';
import {SessionSideColumnComponent} from '../session-side-column/session-side-column.component';

@Component({
    selector: 'app-session-facilitator',
    templateUrl: './session-facilitator.component.html',
    styleUrl: './session-facilitator.component.scss',
    imports: [SessionSideColumnComponent],
})
export class SessionFacilitatorComponent implements OnInit {
    public readonly userService = inject(UserService);

    public facilitators: Users['users']['items'][0][] = [];

    public ngOnInit(): void {
        const qvm = new NaturalQueryVariablesManager<UsersVariables>();
        qvm.set('variables', {
            filter: {groups: [{conditions: [{isPublicFacilitator: {equal: {value: true}}}]}]},
            pagination: {pageSize: 999, pageIndex: 0},
            sorting: [{field: UserSortingField.locality, order: SortingOrder.ASC}],
        });

        this.userService.getAll(qvm).subscribe(result => (this.facilitators = result.items));
    }
}
