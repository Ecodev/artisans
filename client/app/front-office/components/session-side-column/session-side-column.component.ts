import {Component, OnInit} from '@angular/core';
import {NaturalQueryVariablesManager} from '@ecodev/natural';
import {SessionService} from '../../../admin/sessions/services/session.service';
import {SessionsVariables} from '../../../shared/generated-types';

@Component({
    selector: 'app-session-side-column',
    templateUrl: './session-side-column.component.html',
    styleUrls: ['./session-side-column.component.scss'],
})
export class SessionSideColumnComponent implements OnInit {
    public number = 0;

    constructor(private sessionService: SessionService) {}

    ngOnInit(): void {
        const qvm = new NaturalQueryVariablesManager<SessionsVariables>();
        qvm.set('variables', {
            filter: {groups: [{conditions: [{startDate: {greater: {value: new Date()}}}]}]},
            pagination: {pageIndex: 0, pageSize: 0},
        });
        this.sessionService.getAll(qvm).subscribe(result => {
            this.number = result.length;
        });
    }
}
