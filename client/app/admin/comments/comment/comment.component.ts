import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NaturalAbstractDetail} from '@ecodev/natural';
import {NaturalSearchFacetsService} from '../../../shared/natural-search/natural-search-facets.service';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {EventService} from '../../events/services/event.service';
import {NewsService} from '../../newses/services/news.service';
import {CommentService} from '../services/comment.service';

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.scss'],
})
export class CommentComponent extends NaturalAbstractDetail<CommentService> implements OnInit {
    public constructor(
        route: ActivatedRoute,
        commentService: CommentService,
        naturalSearchFacetsService: NaturalSearchFacetsService,
        public readonly newsService: NewsService,
        public readonly eventService: EventService,
        public readonly permissionsService: PermissionsService,
    ) {
        super('comment', commentService);
    }
}
