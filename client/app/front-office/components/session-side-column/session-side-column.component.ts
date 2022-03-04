import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {formatIsoDateTime, NaturalQueryVariablesManager} from '@ecodev/natural';
import {SessionService} from '../../../admin/sessions/services/session.service';
import {UserService} from '../../../admin/users/services/user.service';
import {SessionsVariables} from '../../../shared/generated-types';

@Component({
    selector: 'app-session-side-column',
    templateUrl: './session-side-column.component.html',
    styleUrls: ['./session-side-column.component.scss'],
})
export class SessionSideColumnComponent implements OnInit {
    public number = 0;

    @Input() public hiddenBlocName?: string;

    public constructor(private readonly sessionService: SessionService, private readonly route: ActivatedRoute) {}

    public ngOnInit(): void {
        const qvm = new NaturalQueryVariablesManager<SessionsVariables>();
        qvm.set('variables', {
            filter: {groups: [{conditions: [{startDate: {greater: {value: formatIsoDateTime(new Date())}}}]}]},
            pagination: {pageIndex: 0, pageSize: 0},
        });
        this.sessionService.getAll(qvm).subscribe(result => {
            this.number = result.length;
        });
    }

    public canAccessFacilitatorPrivate(): boolean {
        return UserService.canAccessFacilitatorPrivate(this.route.snapshot.data?.viewer?.model);
    }
}
