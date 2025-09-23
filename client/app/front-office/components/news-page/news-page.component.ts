import {Component, inject, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NaturalAbstractDetail, NaturalCapitalizePipe, NaturalIconDirective} from '@ecodev/natural';
import {NewsService} from '../../../admin/newses/services/news.service';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {CommentListComponent} from '../comment-list/comment-list.component';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {DatePipe} from '@angular/common';

@Component({
    selector: 'app-news-page',
    imports: [
        DatePipe,
        MatIconButton,
        RouterLink,
        MatIcon,
        NaturalIconDirective,
        CommentListComponent,
        NaturalCapitalizePipe,
    ],
    templateUrl: './news-page.component.html',
    styleUrl: './news-page.component.scss',
})
export class NewsPageComponent extends NaturalAbstractDetail<NewsService> implements OnInit {
    public readonly permissionsService = inject(PermissionsService);

    public constructor() {
        super('news', inject(NewsService));
    }
}
