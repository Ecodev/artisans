import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {NaturalAbstractDetail, NaturalIconDirective, NaturalCapitalizePipe} from '@ecodev/natural';
import {EventService} from '../../../admin/events/services/event.service';
import {NaturalSearchFacetsService} from '../../../shared/natural-search/natural-search-facets.service';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {CommentListComponent} from '../comment-list/comment-list.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {NgIf, DatePipe} from '@angular/common';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

@Component({
    selector: 'app-event-page',
    templateUrl: './event-page.component.html',
    styleUrls: ['./event-page.component.scss'],
    standalone: true,
    imports: [
        FlexModule,
        NgIf,
        MatButtonModule,
        RouterLink,
        MatIconModule,
        NaturalIconDirective,
        CommentListComponent,
        DatePipe,
        NaturalCapitalizePipe,
    ],
})
export class EventPageComponent extends NaturalAbstractDetail<EventService> implements OnInit {
    public constructor(
        route: ActivatedRoute,
        eventService: EventService,
        naturalSearchFacetsService: NaturalSearchFacetsService,
        public readonly permissionsService: PermissionsService,
    ) {
        super('event', eventService);
    }
}
