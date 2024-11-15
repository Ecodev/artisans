import {Component, inject, OnInit} from '@angular/core';
import {NaturalCapitalizePipe, PaginationInput} from '@ecodev/natural';
import {EventService} from '../../../admin/events/services/event.service';
import {AbstractInfiniteLoadList} from '../../../shared/classes/AbstractInfiniteLoadList';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-events-page',
    templateUrl: './events-page.component.html',
    styleUrl: './events-page.component.scss',
    standalone: true,
    imports: [RouterLink, CommonModule, MatButtonModule, NaturalCapitalizePipe],
})
export class EventsPageComponent extends AbstractInfiniteLoadList<EventService> implements OnInit {
    public readonly permissionsService = inject(PermissionsService);

    protected override defaultPagination: Required<PaginationInput> = {
        pageSize: 5,
        pageIndex: 0,
        offset: null,
    };

    public constructor() {
        super(inject(EventService));
    }
}
