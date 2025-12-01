import {Component, inject, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NaturalAbstractDetail, NaturalCapitalizePipe, NaturalIconDirective} from '@ecodev/natural';
import {EventService} from '../../../admin/events/services/event.service';
import {CommentListComponent} from '../comment-list/comment-list.component';
import {MatIcon} from '@angular/material/icon';
import {MatMiniFabButton} from '@angular/material/button';
import {DatePipe} from '@angular/common';

@Component({
    selector: 'app-event-page',
    imports: [
        DatePipe,
        RouterLink,
        MatIcon,
        NaturalIconDirective,
        CommentListComponent,
        NaturalCapitalizePipe,
        MatMiniFabButton,
    ],
    templateUrl: './event-page.component.html',
    styleUrl: './event-page.component.scss',
})
export class EventPageComponent extends NaturalAbstractDetail<EventService> implements OnInit {
    public constructor() {
        super('event', inject(EventService));
    }
}
