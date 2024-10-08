import {Component, OnInit, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NaturalAbstractDetail, NaturalCapitalizePipe, NaturalIconDirective} from '@ecodev/natural';
import {EventService} from '../../../admin/events/services/event.service';
import {CommentListComponent} from '../comment-list/comment-list.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-event-page',
    templateUrl: './event-page.component.html',
    styleUrl: './event-page.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        RouterLink,
        MatIconModule,
        NaturalIconDirective,
        CommentListComponent,
        NaturalCapitalizePipe,
    ],
})
export class EventPageComponent extends NaturalAbstractDetail<EventService> implements OnInit {
    public constructor() {
        super('event', inject(EventService));
    }
}
