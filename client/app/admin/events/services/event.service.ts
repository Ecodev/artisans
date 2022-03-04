import {Apollo} from 'apollo-angular';
import {Injectable} from '@angular/core';
import {formatIsoDateTime, FormValidators, Literal, NaturalAbstractModelService} from '@ecodev/natural';
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
import {Validators} from '@angular/forms';

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
    public constructor(apollo: Apollo) {
        super(apollo, 'event', eventQuery, eventsQuery, createEvent, updateEvent, deleteEvents);
    }

    public getDefaultForClient(): Literal {
        return this.getDefaultForServer();
    }

    public getDefaultForServer(): EventInput {
        return {
            name: '',
            place: '',
            type: '',
            date: formatIsoDateTime(new Date()),
        };
    }

    public getFormValidators(model?: Literal): FormValidators {
        return {
            name: [Validators.required],
            date: [Validators.required],
        };
    }
}
