import {Component, Injector, OnInit} from '@angular/core';
import {AvailableColumn, NaturalAbstractList} from '@ecodev/natural';
import {NaturalSearchFacetsService} from '../../../shared/natural-search/natural-search-facets.service';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {CommentService} from '../services/comment.service';

@Component({
    selector: 'app-comments',
    templateUrl: './comments.component.html',
    styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent extends NaturalAbstractList<CommentService> implements OnInit {
    public override availableColumns: AvailableColumn[] = [
        {id: 'description', label: 'Commentaire'},
        {id: 'event', label: 'News'},
        {id: 'news', label: 'Actualité'},
    ];

    public constructor(
        service: CommentService,
        naturalSearchFacetsService: NaturalSearchFacetsService,
        public readonly permissionsService: PermissionsService,
        injector: Injector,
    ) {
        super(service, injector);
    }
}
