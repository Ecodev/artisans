import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {NaturalAbstractDetail, NaturalIconDirective, NaturalCapitalizePipe} from '@ecodev/natural';
import {NewsService} from '../../../admin/newses/services/news.service';
import {NaturalSearchFacetsService} from '../../../shared/natural-search/natural-search-facets.service';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {CommentListComponent} from '../comment-list/comment-list.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

@Component({
    selector: 'app-news-page',
    templateUrl: './news-page.component.html',
    styleUrls: ['./news-page.component.scss'],
    standalone: true,
    imports: [
        FlexModule,
        CommonModule,
        MatButtonModule,
        RouterLink,
        MatIconModule,
        NaturalIconDirective,
        CommentListComponent,
        NaturalCapitalizePipe,
    ],
})
export class NewsPageComponent extends NaturalAbstractDetail<NewsService> implements OnInit {
    public constructor(
        route: ActivatedRoute,
        newsService: NewsService,
        naturalSearchFacetsService: NaturalSearchFacetsService,
        public readonly permissionsService: PermissionsService,
    ) {
        super('news', newsService);
    }
}
