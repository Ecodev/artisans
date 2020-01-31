import { Component, Injector, OnInit } from '@angular/core';
import { NaturalAbstractDetail } from '@ecodev/natural';
import { SessionService } from '../../../admin/sessions/services/session.service';
import {
    CreateSession,
    CreateSessionVariables,
    Session,
    SessionVariables,
    UpdateSession,
    UpdateSessionVariables, UserRole,
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
     * For template usage
     */
    public UserRole = UserRole;


    constructor(private sessionService: SessionService, injector: Injector) {
        super('session', sessionService, injector);
    }

}
