import { Component, Injector, OnInit } from '@angular/core';
import { NaturalAbstractDetail, NaturalQueryVariablesManager } from '@ecodev/natural';
import { SessionService } from '../../../admin/sessions/services/session.service';
import { UserService } from '../../../admin/users/services/user.service';
import {
    CreateSession,
    CreateSessionVariables, CurrentUserForProfile_viewer,
    Session,
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
export class SessionPageComponent extends NaturalAbstractDetail<Session['session'],
    SessionVariables,
    CreateSession['createSession'],
    CreateSessionVariables,
    UpdateSession['updateSession'],
    UpdateSessionVariables,
    any> implements OnInit {

    /**
     * Session animators/facilitators
     */
    public facilitators: Users_users_items[] = [];

    /**
     * For template usage
     */
    public UserRole = UserRole;

    public viewer: CurrentUserForProfile_viewer;

    constructor(private sessionService: SessionService, injector: Injector, public userService: UserService) {
        super('session', sessionService, injector);
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.viewer = this.route.snapshot.data.viewer ? this.route.snapshot.data.viewer.model : null;

        this.route.data.subscribe(data => {

            if (data.session) {
                const qvm = new NaturalQueryVariablesManager<UsersVariables>();
                qvm.set('variables', {filter: {groups: [{conditions: [{sessions: {have: {values: [data.session.model.id]}}}]}]}});
                this.userService.getAll(qvm).subscribe(result => this.facilitators = result.items);
            }

        });
    }

}
