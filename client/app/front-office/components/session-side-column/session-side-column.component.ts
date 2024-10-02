import {Component, Input, OnInit, inject} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {formatIsoDateTime, NaturalQueryVariablesManager} from '@ecodev/natural';
import {SessionService} from '../../../admin/sessions/services/session.service';
import {UserService} from '../../../admin/users/services/user.service';
import {SessionsVariables} from '../../../shared/generated-types';
import {MatButtonModule} from '@angular/material/button';

@Component({
    selector: 'app-session-side-column',
    templateUrl: './session-side-column.component.html',
    styleUrl: './session-side-column.component.scss',
    standalone: true,
    imports: [MatButtonModule, RouterLink],
})
export class SessionSideColumnComponent implements OnInit {
    private readonly sessionService = inject(SessionService);
    private readonly route = inject(ActivatedRoute);

    public number = 0;

    @Input() public hiddenBlocName?: string;

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
        return UserService.canAccessFacilitatorPrivate(this.route.snapshot.data?.viewer);
    }
}
