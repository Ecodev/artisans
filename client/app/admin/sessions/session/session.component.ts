import { Component, Injector, OnInit } from '@angular/core';
import { NaturalAbstractDetail } from '@ecodev/natural';
import { merge, omit } from 'lodash';
import {
    CreateSession,
    CreateSessionVariables,
    Session,
    SessionVariables,
    UpdateSession,
    UpdateSessionVariables,
} from '../../../shared/generated-types';
import { SessionService } from '../services/session.service';

@Component({
    selector: 'app-session',
    templateUrl: './session.component.html',
    styleUrls: ['./session.component.scss'],
})
export class SessionComponent
    extends NaturalAbstractDetail<Session['session'],
        SessionVariables,
        CreateSession['createSession'],
        CreateSessionVariables,
        UpdateSession['updateSession'],
        UpdateSessionVariables,
        any> implements OnInit {

    constructor(private sessionService: SessionService, injector: Injector) {
        super('session', sessionService, injector);
    }


}
