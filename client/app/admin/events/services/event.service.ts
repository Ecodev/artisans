import {Apollo} from 'apollo-angular';
import {Injectable} from '@angular/core';
import {
    formatIsoDateTime,
    FormValidators,
    Literal,
    NaturalAbstractModelService,
    NaturalDebounceService,
} from '@ecodev/natural';
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
    public constructor(apollo: Apollo, naturalDebounceService: NaturalDebounceService) {
        super(apollo, naturalDebounceService, 'event', eventQuery, eventsQuery, createEvent, updateEvent, deleteEvents);
    }

    public override getDefaultForClient(): Literal {
        return this.getDefaultForServer();
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
