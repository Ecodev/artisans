import {Component, Injector, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NaturalAbstractDetail} from '@ecodev/natural';
import {EventService} from '../../../admin/events/services/event.service';
import {
    CreateEvent,
    CreateEventVariables,
    DeleteEvents,
    DeleteEventsVariables,
    Event,
    EventVariables,
    UpdateEvent,
    UpdateEventVariables,
    UserRole,
} from '../../../shared/generated-types';
import {NaturalSearchFacetsService} from '../../../shared/natural-search/natural-search-facets.service';
import {PermissionsService} from '../../../shared/services/permissions.service';

@Component({
    selector: 'app-event-page',
    templateUrl: './event-page.component.html',
    styleUrls: ['./event-page.component.scss'],
})
export class EventPageComponent extends NaturalAbstractDetail<EventService> implements OnInit {
    constructor(
        route: ActivatedRoute,
        eventService: EventService,
        naturalSearchFacetsService: NaturalSearchFacetsService,
        public readonly permissionsService: PermissionsService,
        injector: Injector,
    ) {
        super('event', eventService, injector);
    }
}
