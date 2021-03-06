import {Component, Injector, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NaturalAbstractDetail} from '@ecodev/natural';
import {
    CreateEvent,
    CreateEventVariables,
    DeleteEvents,
    DeleteEventsVariables,
    Event,
    EventVariables,
    UpdateEvent,
    UpdateEventVariables,
} from '../../../shared/generated-types';
import {NaturalSearchFacetsService} from '../../../shared/natural-search/natural-search-facets.service';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {EventService} from '../services/event.service';

@Component({
    selector: 'app-event',
    templateUrl: './event.component.html',
    styleUrls: ['./event.component.scss'],
})
export class EventComponent extends NaturalAbstractDetail<EventService> implements OnInit {
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
