import {Component, OnInit} from '@angular/core';
import {Literal, NaturalQueryVariablesManager, NaturalIconDirective} from '@ecodev/natural';
import {groupBy, sortBy} from 'lodash-es';
import {FacilitatorDocumentsService} from '../../../admin/facilitator-documents/services/facilitator-documents.service';
import {UserService} from '../../../admin/users/services/user.service';
import {SortingOrder, UserRole, Users, UserSortingField, UsersVariables} from '../../../shared/generated-types';
import {SessionSideColumnComponent} from '../session-side-column/session-side-column.component';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-session-facilitator-private',
    templateUrl: './session-facilitator-private.component.html',
    styleUrl: './session-facilitator-private.component.scss',
    standalone: true,
    imports: [CommonModule, MatListModule, MatIconModule, NaturalIconDirective, SessionSideColumnComponent],
})
export class SessionFacilitatorPrivateComponent implements OnInit {
    public facilitators: Users['users']['items'][0][] = [];
    public categories: Literal = {};

    public constructor(
        public readonly userService: UserService,
        private readonly facilitatorDocumentService: FacilitatorDocumentsService,
    ) {}

    public ngOnInit(): void {
        const qvm = new NaturalQueryVariablesManager<UsersVariables>();
        qvm.set('variables', {
            filter: {groups: [{conditions: [{role: {in: {values: [UserRole.facilitator]}}}]}]},
            pagination: {pageSize: 999, pageIndex: 0},
            sorting: [{field: UserSortingField.locality, order: SortingOrder.ASC}],
        });

        this.userService.getAll(qvm).subscribe(result => (this.facilitators = result.items));
        this.facilitatorDocumentService.getAll(new NaturalQueryVariablesManager()).subscribe(documents => {
            console.log(documents);
            this.categories = groupBy(sortBy(documents.items, 'category.name'), 'category');
        });
    }
}
