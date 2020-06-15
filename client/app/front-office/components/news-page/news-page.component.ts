import {Component, Injector, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NaturalAbstractDetail} from '@ecodev/natural';
import {NewsService} from '../../../admin/newses/services/news.service';
import {
    CreateNews,
    CreateNewsVariables,
    DeleteNewses,
    DeleteNewsesVariables,
    News,
    NewsVariables,
    UpdateNews,
    UpdateNewsVariables,
} from '../../../shared/generated-types';
import {NaturalSearchFacetsService} from '../../../shared/natural-search/natural-search-facets.service';
import {PermissionsService} from '../../../shared/services/permissions.service';

@Component({
    selector: 'app-news-page',
    templateUrl: './news-page.component.html',
    styleUrls: ['./news-page.component.scss'],
})
export class NewsPageComponent
    extends NaturalAbstractDetail<
        News['news'],
        NewsVariables,
        CreateNews['createNews'],
        CreateNewsVariables,
        UpdateNews['updateNews'],
        UpdateNewsVariables,
        DeleteNewses,
        DeleteNewsesVariables
    >
    implements OnInit {
    constructor(
        route: ActivatedRoute,
        newsService: NewsService,
        naturalSearchFacetsService: NaturalSearchFacetsService,
        public permissionsService: PermissionsService,
        injector: Injector,
    ) {
        super('news', newsService, injector);
    }
}
