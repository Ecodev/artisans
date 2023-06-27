import {Component, OnInit} from '@angular/core';
import {PaginationInput, NaturalCapitalizePipe} from '@ecodev/natural';
import {EventService} from '../../../admin/events/services/event.service';
import {AbstractInfiniteLoadList} from '../../../shared/classes/AbstractInfiniteLoadList';
import {NaturalSearchFacetsService} from '../../../shared/natural-search/natural-search-facets.service';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {NgFor, NgIf, DatePipe} from '@angular/common';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

@Component({
    selector: 'app-events-page',
    templateUrl: './events-page.component.html',
    styleUrls: ['./events-page.component.scss'],
    standalone: true,
    imports: [FlexModule, NgFor, RouterLink, NgIf, MatButtonModule, DatePipe, NaturalCapitalizePipe],
})
export class EventsPageComponent extends AbstractInfiniteLoadList<EventService> implements OnInit {
    protected override defaultPagination: Required<PaginationInput> = {
        pageSize: 5,
        pageIndex: 0,
        offset: null,
    };

    public constructor(
        service: EventService,
        naturalSearchFacetsService: NaturalSearchFacetsService,
        public readonly permissionsService: PermissionsService,
    ) {
        super(service);
    }
}
