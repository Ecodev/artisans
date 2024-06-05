import {Component, OnInit} from '@angular/core';
import {formatIsoDateTime, NaturalQueryVariablesManager} from '@ecodev/natural';
import {SessionService} from '../../../admin/sessions/services/session.service';
import {Sessions, SessionSortingField, SessionsVariables, SortingOrder} from '../../../shared/generated-types';
import {SessionSideColumnComponent} from '../session-side-column/session-side-column.component';
import {MatButtonModule} from '@angular/material/button';

@Component({
    selector: 'app-sessions-incoming',
    templateUrl: './sessions-incoming.component.html',
    styleUrl: './sessions-incoming.component.scss',
    standalone: true,
    imports: [MatButtonModule, SessionSideColumnComponent],
})
export class SessionsIncomingComponent implements OnInit {
    public sessions: Sessions['sessions']['items'][0][] = [];

    public constructor(private readonly sessionService: SessionService) {}

    public ngOnInit(): void {
        // Get sessions
        const qvm = new NaturalQueryVariablesManager<SessionsVariables>();

        qvm.set('variables', {
            filter: {groups: [{conditions: [{startDate: {greater: {value: formatIsoDateTime(new Date())}}}]}]},
            pagination: {pageIndex: 0, pageSize: 999},
            sorting: [{field: SessionSortingField.name, order: SortingOrder.ASC}],
        });

        this.sessionService.getAll(qvm).subscribe(data => (this.sessions = data.items));
    }
}
