import {Component, Injector, OnInit} from '@angular/core';
import {NaturalAbstractDetail, NaturalQueryVariablesManager} from '@ecodev/natural';
import {SessionService} from '../../../admin/sessions/services/session.service';
import {UserService} from '../../../admin/users/services/user.service';
import {
    CreateSession,
    CreateSessionVariables,
    CurrentUserForProfile_viewer,
    Session,
    Session_session,
    Sessions_sessions_items,
    SessionsVariables,
    SessionVariables,
    UpdateSession,
    UpdateSessionVariables,
    UserRole,
    Users_users_items,
    UsersVariables,
} from '../../../shared/generated-types';

@Component({
    selector: 'app-session-page',
    templateUrl: './session-page.component.html',
    styleUrls: ['./session-page.component.scss'],
})
export class SessionPageComponent
    extends NaturalAbstractDetail<
        Session['session'],
        SessionVariables,
        CreateSession['createSession'],
        CreateSessionVariables,
        UpdateSession['updateSession'],
        UpdateSessionVariables,
        any,
        any
    >
    implements OnInit {
    /**
     * Session animators/facilitators
     */
    public facilitators: Users_users_items[] = [];

    /**
     * Other sessions in same place
     */
    public otherSessions: Sessions_sessions_items[] = [];

    /**
     * For template usage
     */
    public UserRole = UserRole;

    public viewer: CurrentUserForProfile_viewer | null = null;

    constructor(private sessionService: SessionService, injector: Injector, public userService: UserService) {
        super('session', sessionService, injector);
    }

    public ngOnInit(): void {
        super.ngOnInit();

        this.viewer = this.route.snapshot.data.viewer ? this.route.snapshot.data.viewer.model : null;

        this.route.data.subscribe(data => {
            if (data.session) {
                // this.refreshFacilitators(data.session.model);
                this.refreshOtherSessions(data.session.model);
            }
        });
    }

    /**
     * Fetch other future sessions (5 max) in same locality
     */
    private refreshOtherSessions(session: Session_session): void {
        const qvm = new NaturalQueryVariablesManager<SessionsVariables>();
        qvm.set('variables', {
            filter: {
                groups: [
                    {
                        conditions: [
                            {locality: {in: {values: [session.locality]}}},
                            {id: {in: {values: [session.id], not: true}}},
                            {startDate: {greaterOrEqual: {value: new Date()}}},
                        ],
                    },
                ],
            },
            pagination: {pageSize: 5, pageIndex: 0},
        });
        this.service.getAll(qvm).subscribe(result => (this.otherSessions = result.items));
    }
}
