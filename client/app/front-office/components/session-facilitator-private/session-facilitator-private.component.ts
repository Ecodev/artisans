import {Component, inject, OnInit} from '@angular/core';
import {Literal, NaturalIconDirective, NaturalQueryVariablesManager} from '@ecodev/natural';
import {groupBy, sortBy} from 'es-toolkit';
import {FacilitatorDocumentsService} from '../../../admin/facilitator-documents/services/facilitator-documents.service';
import {UserService} from '../../../admin/users/services/user.service';
import {
    SortingOrder,
    UserRole,
    UserSortingField,
    UsersQuery,
    UsersQueryVariables,
} from '../../../shared/generated-types';
import {SessionSideColumnComponent} from '../session-side-column/session-side-column.component';
import {MatIcon} from '@angular/material/icon';
import {MatListItem, MatNavList} from '@angular/material/list';
import {KeyValuePipe} from '@angular/common';

@Component({
    selector: 'app-session-facilitator-private',
    imports: [KeyValuePipe, MatNavList, MatListItem, MatIcon, NaturalIconDirective, SessionSideColumnComponent],
    templateUrl: './session-facilitator-private.component.html',
    styleUrl: './session-facilitator-private.component.scss',
})
export class SessionFacilitatorPrivateComponent implements OnInit {
    protected readonly userService = inject(UserService);
    private readonly facilitatorDocumentService = inject(FacilitatorDocumentsService);

    protected facilitators: UsersQuery['users']['items'][0][] = [];
    protected categories: Literal = {};

    public ngOnInit(): void {
        const qvm = new NaturalQueryVariablesManager<UsersQueryVariables>();
        qvm.set('variables', {
            filter: {groups: [{conditions: [{role: {in: {values: [UserRole.facilitator]}}}]}]},
            pagination: {pageSize: 999, pageIndex: 0},
            sorting: [{field: UserSortingField.locality, order: SortingOrder.ASC}],
        });

        this.userService.getAll(qvm).subscribe(result => (this.facilitators = result.items));
        this.facilitatorDocumentService.getAll(new NaturalQueryVariablesManager()).subscribe(documents => {
            this.categories = groupBy(sortBy(documents.items, [d => d.category]), d => d.category);
        });
    }
}
