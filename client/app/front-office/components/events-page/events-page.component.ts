import {Component, OnInit} from '@angular/core';
import {PaginationInput, NaturalCapitalizePipe} from '@ecodev/natural';
import {EventService} from '../../../admin/events/services/event.service';
import {AbstractInfiniteLoadList} from '../../../shared/classes/AbstractInfiniteLoadList';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

@Component({
    selector: 'app-events-page',
    templateUrl: './events-page.component.html',
    styleUrl: './events-page.component.scss',
    standalone: true,
    imports: [FlexModule, RouterLink, CommonModule, MatButtonModule, NaturalCapitalizePipe],
})
export class EventsPageComponent extends AbstractInfiniteLoadList<EventService> implements OnInit {
    protected override defaultPagination: Required<PaginationInput> = {
        pageSize: 5,
        pageIndex: 0,
        offset: null,
    };

    public constructor(
        service: EventService,
        public readonly permissionsService: PermissionsService,
    ) {
        super(service);
    }
}
