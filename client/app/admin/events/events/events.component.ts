import {Component, Injector, OnInit} from '@angular/core';
import {AvailableColumn, NaturalAbstractList} from '@ecodev/natural';
import {NaturalSearchFacetsService} from '../../../shared/natural-search/natural-search-facets.service';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {EventService} from '../services/event.service';

@Component({
    selector: 'app-events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.scss'],
})
export class EventsComponent extends NaturalAbstractList<EventService> implements OnInit {
    public override availableColumns: AvailableColumn[] = [
        {id: 'date', label: 'Date'},
        {id: 'name', label: 'Nom'},
        {id: 'place', label: 'Lieu'},
        {id: 'type', label: 'Type'},
    ];
    public constructor(
        service: EventService,
        naturalSearchFacetsService: NaturalSearchFacetsService,
        public readonly permissionsService: PermissionsService,
        injector: Injector,
    ) {
        super(service, injector);
    }
}
