import {Component, inject, OnInit} from '@angular/core';
import {NaturalCapitalizePipe, PaginationInput} from '@ecodev/natural';
import {EventService} from '../../../admin/events/services/event.service';
import {AbstractInfiniteLoadList} from '../../../shared/classes/AbstractInfiniteLoadList';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {RouterLink} from '@angular/router';
import {DatePipe} from '@angular/common';

@Component({
    selector: 'app-events-page',
    imports: [RouterLink, DatePipe, NaturalCapitalizePipe],
    templateUrl: './events-page.component.html',
    styleUrl: './events-page.component.scss',
})
export class EventsPageComponent extends AbstractInfiniteLoadList<EventService> implements OnInit {
    protected readonly permissionsService = inject(PermissionsService);

    protected override defaultPagination: Required<PaginationInput> = {
        pageSize: 200,
        pageIndex: 0,
        offset: null,
    };

    public constructor() {
        super(inject(EventService));
    }
}
