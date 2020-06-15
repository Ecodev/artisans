import {Component, Injector, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NaturalAbstractDetail} from '@ecodev/natural';
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
import {NewsService} from '../services/news.service';

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.scss'],
})
export class NewsComponent
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
