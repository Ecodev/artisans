import {Component, Injector, OnInit} from '@angular/core';
import {PaginationInput} from '@ecodev/natural';
import {EventService} from '../../../admin/events/services/event.service';
import {AbstractInfiniteLoadList} from '../../../shared/classes/AbstractInfiniteLoadList';
import {NaturalSearchFacetsService} from '../../../shared/natural-search/natural-search-facets.service';
import {PermissionsService} from '../../../shared/services/permissions.service';

@Component({
    selector: 'app-events-page',
    templateUrl: './events-page.component.html',
    styleUrls: ['./events-page.component.scss'],
})
export class EventsPageComponent extends AbstractInfiniteLoadList<EventService> implements OnInit {
    protected defaultPagination: Required<PaginationInput> = {
        pageSize: 5,
        pageIndex: 0,
        offset: null,
    };

    constructor(
        service: EventService,
        naturalSearchFacetsService: NaturalSearchFacetsService,
        public readonly permissionsService: PermissionsService,
        injector: Injector,
    ) {
        super(service, injector);
    }
}
