import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {
    NaturalAbstractDetail,
    NaturalDetailHeaderComponent,
    NaturalLinkableTabDirective,
    NaturalSelectComponent,
    NaturalStampComponent,
    NaturalFixedButtonDetailComponent,
} from '@ecodev/natural';
import {NaturalSearchFacetsService} from '../../../shared/natural-search/natural-search-facets.service';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {EventService} from '../../events/services/event.service';
import {NewsService} from '../../newses/services/news.service';
import {CommentService} from '../services/comment.service';
import {CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FlexModule} from '@ngbracket/ngx-layout/flex';
import {MatTabsModule} from '@angular/material/tabs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NaturalDetailHeaderComponent,
        MatTabsModule,
        NaturalLinkableTabDirective,
        FlexModule,
        MatFormFieldModule,
        MatInputModule,
        CommonModule,
        NaturalSelectComponent,
        NaturalStampComponent,
        NaturalFixedButtonDetailComponent,
    ],
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
