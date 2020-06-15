import {Injectable} from '@angular/core';
import {NaturalAbstractModelService} from '@ecodev/natural';
import {Apollo} from 'apollo-angular';

import {
    CreateEvent,
    CreateEventVariables,
    DeleteEvents,
    DeleteEventsVariables,
    Event,
    EventInput,
    Events,
    EventsVariables,
    EventVariables,
    UpdateEvent,
    UpdateEventVariables,
} from '../../../shared/generated-types';
import {createEvent, deleteEvents, eventQuery, eventsQuery, updateEvent} from './event.queries';

@Injectable({
    providedIn: 'root',
})
export class EventService extends NaturalAbstractModelService<
    Event['event'],
    EventVariables,
    Events['events'],
    EventsVariables,
    CreateEvent['createEvent'],
    CreateEventVariables,
    UpdateEvent['updateEvent'],
    UpdateEventVariables,
    DeleteEvents,
    DeleteEventsVariables
> {
    constructor(apollo: Apollo) {
        super(apollo, 'event', eventQuery, eventsQuery, createEvent, updateEvent, deleteEvents);
    }

    public getDefaultForClient() {
        return this.getDefaultForServer();
    }

    public getDefaultForServer(): EventInput {
        return {
            name: '',
            place: '',
            type: '',
            date: new Date(),
        };
    }
}
