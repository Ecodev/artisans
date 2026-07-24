import {Injectable} from '@angular/core';
import {formatIsoDateTime, type FormValidators, NaturalAbstractModelService} from '@ecodev/natural';
import {
    type CreateEvent,
    type CreateEventVariables,
    type DeleteEvents,
    type DeleteEventsVariables,
    type EventInput,
    type EventQuery,
    type EventQueryVariables,
    type EventsQuery,
    type EventsQueryVariables,
    type UpdateEvent,
    type UpdateEventVariables,
} from '../../../shared/generated-types';
import {createEvent, deleteEvents, eventQuery, eventsQuery, updateEvent} from './event.queries';
import {Validators} from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class EventService extends NaturalAbstractModelService<
    EventQuery['event'],
    EventQueryVariables,
    EventsQuery['events'],
    EventsQueryVariables,
    CreateEvent['createEvent'],
    CreateEventVariables,
    UpdateEvent['updateEvent'],
    UpdateEventVariables,
    DeleteEvents,
    DeleteEventsVariables
> {
    public constructor() {
        super('event', eventQuery, eventsQuery, createEvent, updateEvent, deleteEvents);
    }

    public override getDefaultForServer(): EventInput {
        return {
            name: '',
            place: '',
            type: '',
            date: formatIsoDateTime(new Date()),
        };
    }

    public override getFormValidators(): FormValidators {
        return {
            name: [Validators.required],
            date: [Validators.required],
        };
    }
}
