import {Apollo} from 'apollo-angular';
import {Injectable} from '@angular/core';
import {Validators} from '@angular/forms';
import {FormValidators, Literal, NaturalAbstractModelService} from '@ecodev/natural';
import {
    CreateSession,
    CreateSessionVariables,
    DeleteSessions,
    DeleteSessionsVariables,
    JoinType,
    Session,
    SessionInput,
    SessionPartialInput,
    Sessions,
    SessionsVariables,
    SessionVariables,
    UpdateSession,
    UpdateSessionVariables,
} from '../../../shared/generated-types';
import {createSession, deleteSessions, sessionQuery, sessionsQuery, updateSession} from './session.queries';

@Injectable({
    providedIn: 'root',
})
export class SessionService extends NaturalAbstractModelService<
    Session['session'],
    SessionVariables,
    Sessions['sessions'],
    SessionsVariables,
    CreateSession['createSession'],
    CreateSessionVariables,
    UpdateSession['updateSession'],
    UpdateSessionVariables,
    DeleteSessions,
    DeleteSessionsVariables
> {
    constructor(apollo: Apollo) {
        super(apollo, 'session', sessionQuery, sessionsQuery, createSession, updateSession, deleteSessions);
    }

    public getFormValidators(): FormValidators {
        return {
            name: [Validators.required, Validators.maxLength(100)],
            startDate: [Validators.required],
        };
    }

    public getInput(object: Literal): SessionInput | SessionPartialInput {
        object.description = object.description || '';
        return super.getInput(object);
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
            endDate: null,
            description: '',
            mailingList: '',
        };
    }

    public getPartialVariablesForAll(): Partial<SessionsVariables> {
        return {
            filter: {
                groups: [
                    {
                        joins: {
                            facilitators: {type: JoinType.leftJoin},
                        },
                    },
                ],
            },
        };
    }
}
