import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NaturalAbstractDetail } from '@ecodev/natural';
import { QuillModules } from 'ngx-quill';
import { quillConfig } from '../../../shared/config/quill.options';
import { CreateNews, CreateNewsVariables, News, NewsVariables, UpdateNews, UpdateNewsVariables } from '../../../shared/generated-types';
import { NaturalSearchFacetsService } from '../../../shared/natural-search/natural-search-facets.service';
import { PermissionsService } from '../../../shared/services/permissions.service';
import { NewsService } from '../services/news.service';

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.scss'],
})

export class NewsComponent
    extends NaturalAbstractDetail<News['news'],
        NewsVariables,
        CreateNews['createNews'],
        CreateNewsVariables,
        UpdateNews['updateNews'],
        UpdateNewsVariables,
        any> implements OnInit {

    public quillModules: QuillModules = {
        ...quillConfig.modules,
    };

    constructor(route: ActivatedRoute,
                newsService: NewsService,
                naturalSearchFacetsService: NaturalSearchFacetsService,
                public permissionsService: PermissionsService,
                injector: Injector,
    ) {

        super('news', newsService, injector);
    }

}
