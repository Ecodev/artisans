import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NaturalAbstractDetail, NaturalCapitalizePipe, NaturalIconDirective} from '@ecodev/natural';
import {NewsService} from '../../../admin/newses/services/news.service';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {CommentListComponent} from '../comment-list/comment-list.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

@Component({
    selector: 'app-news-page',
    templateUrl: './news-page.component.html',
    styleUrl: './news-page.component.scss',
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
        newsService: NewsService,
        public readonly permissionsService: PermissionsService,
    ) {
        super('news', newsService);
    }
}
