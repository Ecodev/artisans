import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NaturalAbstractDetail } from '@ecodev/natural';
import {
    Comment,
    CommentVariables,
    CreateComment,
    CreateCommentVariables,
    UpdateComment,
    UpdateCommentVariables,
} from '../../../shared/generated-types';
import { NaturalSearchFacetsService } from '../../../shared/natural-search/natural-search-facets.service';
import { PermissionsService } from '../../../shared/services/permissions.service';
import { EventService } from '../../events/services/event.service';
import { NewsService } from '../../newses/services/news.service';
import { CommentService } from '../services/comment.service';

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.scss'],
})

export class CommentComponent
    extends NaturalAbstractDetail<Comment['comment'],
        CommentVariables,
        CreateComment['createComment'],
        CreateCommentVariables,
        UpdateComment['updateComment'],
        UpdateCommentVariables,
        any> implements OnInit {

    constructor(route: ActivatedRoute,
                commentService: CommentService,
                naturalSearchFacetsService: NaturalSearchFacetsService,
                injector: Injector,
                public newsService: NewsService,
                public eventService: EventService,
                public permissionsService: PermissionsService,
    ) {

        super('comment', commentService, injector);
    }

}
