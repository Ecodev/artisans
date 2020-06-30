import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NaturalQueryVariablesManager} from '@ecodev/natural';
import {forkJoin} from 'rxjs';
import {SessionService} from '../../../admin/sessions/services/session.service';
import {
    Sessions_sessions_items,
    SessionSortingField,
    SessionsVariables,
    SortingOrder,
} from '../../../shared/generated-types';

@Component({
    selector: 'app-sessions-incoming',
    templateUrl: './sessions-incoming.component.html',
    styleUrls: ['./sessions-incoming.component.scss'],
})
export class SessionsIncomingComponent implements OnInit {
    public sessions: Sessions_sessions_items[];

    constructor(private sessionService: SessionService, public router: Router, public route: ActivatedRoute) {}

    ngOnInit(): void {
        // Get sessions
        const qvm = new NaturalQueryVariablesManager<SessionsVariables>();

        qvm.set('variables', {
            filter: {groups: [{conditions: [{startDate: {greater: {value: new Date()}}}]}]},
            pagination: {pageIndex: 0, pageSize: 999},
            sorting: [{field: SessionSortingField.name, order: SortingOrder.ASC}],
        });

        this.sessionService.getAll(qvm).subscribe(data => (this.sessions = data.items));
    }
}
