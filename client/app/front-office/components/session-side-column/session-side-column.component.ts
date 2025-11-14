import {Component, inject, input, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {formatIsoDateTime, NaturalQueryVariablesManager} from '@ecodev/natural';
import {SessionService} from '../../../admin/sessions/services/session.service';
import {UserService} from '../../../admin/users/services/user.service';
import {SessionsVariables} from '../../../shared/generated-types';
import {MatButton} from '@angular/material/button';

@Component({
    selector: 'app-session-side-column',
    imports: [MatButton, RouterLink],
    templateUrl: './session-side-column.component.html',
    styleUrl: './session-side-column.component.scss',
})
export class SessionSideColumnComponent implements OnInit {
    private readonly sessionService = inject(SessionService);
    private readonly route = inject(ActivatedRoute);

    public number = 0;

    public readonly hiddenBlocName = input<string>();

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

    protected canAccessFacilitatorPrivate(): boolean {
        return UserService.canAccessFacilitatorPrivate(this.route.snapshot.data?.viewer);
    }
}
