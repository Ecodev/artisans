import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormValidators, NaturalAbstractModelService } from '@ecodev/natural';
import { Apollo } from 'apollo-angular';
import {
    CreateSession,
    CreateSessionVariables,
    DeleteSessions,
    Session,
    SessionInput,
    Sessions,
    SessionsVariables,
    SessionVariables,
    UpdateSession,
    UpdateSessionVariables,
} from '../../../shared/generated-types';
import { createSession, deleteSessions, sessionQuery, sessionsQuery, updateSession } from './session.queries';

@Injectable({
    providedIn: 'root',
})
export class SessionService extends NaturalAbstractModelService<Session['session'],
    SessionVariables,
    Sessions['sessions'],
    SessionsVariables,
    CreateSession['createSession'],
    CreateSessionVariables,
    UpdateSession['updateSession'],
    UpdateSessionVariables,
    DeleteSessions> {

    constructor(apollo: Apollo) {
        super(apollo,
            'session',
            sessionQuery,
            sessionsQuery,
            createSession,
            updateSession,
            deleteSessions);
    }

    public getFormValidators(): FormValidators {
        return {
            name: [Validators.required, Validators.maxLength(100)],
            startDate: [Validators.required],
        };
    }

    protected getDefaultForServer(): SessionInput {
        return {
            name: '',
            street: '',
            locality: '',
            region: '',
            price: '',
            availability: '',
            dates: [], // todo
            startDate: null,
            description: '',
        };
    }

}
