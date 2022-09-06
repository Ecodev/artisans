import {Apollo} from 'apollo-angular';
import {Injectable} from '@angular/core';
import {Validators} from '@angular/forms';
import {FormValidators, Literal, NaturalAbstractModelService, NaturalDebounceService} from '@ecodev/natural';
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
import {Observable, of} from 'rxjs';

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
    public constructor(apollo: Apollo, naturalDebounceService: NaturalDebounceService) {
        super(
            apollo,
            naturalDebounceService,
            'session',
            sessionQuery,
            sessionsQuery,
            createSession,
            updateSession,
            deleteSessions,
        );
    }

    public getFormValidators(): FormValidators {
        return {
            name: [Validators.required, Validators.maxLength(100)],
            startDate: [Validators.required],
            endDate: [Validators.required],
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
            dates: [],
            startDate: '',
            endDate: '',
            description: '',
            mailingList: '',
            internalRemarks: '',
        };
    }

    public getPartialVariablesForAll(): Observable<Partial<SessionsVariables>> {
        return of({
            filter: {
                groups: [
                    {
                        joins: {
                            facilitators: {type: JoinType.leftJoin},
                        },
                    },
                ],
            },
        });
    }
}
