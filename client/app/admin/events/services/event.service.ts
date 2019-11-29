import { Injectable } from '@angular/core';
import { NaturalAbstractModelService } from '@ecodev/natural';
import { Apollo } from 'apollo-angular';

import {
    CreateEvent,
    CreateEventVariables,
    DeleteEvents,
    Event,
    Events,
    EventsVariables,
    EventInput,
    EventVariables,
    UpdateEvent,
    UpdateEventVariables,
} from '../../../shared/generated-types';
import { createEvent, deleteEvents, eventsQuery, eventQuery, updateEvent } from './event.queries';

@Injectable({
    providedIn: 'root',
})
export class EventService
    extends NaturalAbstractModelService<Event['event'],
        EventVariables,
        Events['events'],
        EventsVariables,
        CreateEvent['createEvent'],
        CreateEventVariables,
        UpdateEvent['updateEvent'],
        UpdateEventVariables,
        DeleteEvents['deleteEvents']> {

    constructor(apollo: Apollo) {
        super(apollo,
            'event',
            eventQuery,
            eventsQuery,
            createEvent,
            updateEvent,
            deleteEvents);
    }

    public getDefaultForClient() {
        return this.getDefaultForServer();
    }

    public getDefaultForServer(): EventInput {
        return {
            name: '',
            description: '',
            date: new Date()
        };
    }

}
