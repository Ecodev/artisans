import { Component, Injector, OnInit } from '@angular/core';
import { NaturalAbstractList } from '@ecodev/natural';
import { Events, EventsVariables } from '../../../shared/generated-types';
import { NaturalSearchFacetsService } from '../../../shared/natural-search/natural-search-facets.service';
import { PermissionsService } from '../../../shared/services/permissions.service';
import { EventService } from '../services/event.service';

@Component({
    selector: 'app-events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.scss'],

})
export class EventsComponent extends NaturalAbstractList<Events['events'], EventsVariables> implements OnInit {

    public displayedColumns = ['name'];

    constructor(service: EventService,
                naturalSearchFacetsService: NaturalSearchFacetsService,
                public permissionsService: PermissionsService,
                injector: Injector) {

        super(service, injector);
    }

}
