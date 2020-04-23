import { Component, Injector, OnInit } from '@angular/core';
import { NaturalAbstractList } from '@ecodev/natural';
import { Comments, CommentsVariables } from '../../../shared/generated-types';
import { NaturalSearchFacetsService } from '../../../shared/natural-search/natural-search-facets.service';
import { PermissionsService } from '../../../shared/services/permissions.service';
import { CommentService } from '../services/comment.service';

@Component({
    selector: 'app-comments',
    templateUrl: './comments.component.html',
    styleUrls: ['./comments.component.scss'],

})
export class CommentsComponent extends NaturalAbstractList<Comments['comments'], CommentsVariables> implements OnInit {

    public displayedColumns = ['name'];

    constructor(service: CommentService,
                naturalSearchFacetsService: NaturalSearchFacetsService,
                public permissionsService: PermissionsService,
                injector: Injector) {

        super(service, injector);
    }

}