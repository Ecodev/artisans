import {Component} from '@angular/core';
import {PaginationInput} from '@ecodev/natural';
import {NewsService} from '../../../admin/newses/services/news.service';
import {AbstractInfiniteLoadList} from '../../../shared/classes/AbstractInfiniteLoadList';
import {NaturalSearchFacetsService} from '../../../shared/natural-search/natural-search-facets.service';
import {PermissionsService} from '../../../shared/services/permissions.service';

@Component({
    selector: 'app-newses-page',
    templateUrl: './newses-page.component.html',
    styleUrls: ['./newses-page.component.scss'],
})
export class NewsesPageComponent extends AbstractInfiniteLoadList<NewsService> {
    protected override defaultPagination: Required<PaginationInput> = {
        pageSize: 5,
        pageIndex: 0,
        offset: null,
    };

    public constructor(
        service: NewsService,
        naturalSearchFacetsService: NaturalSearchFacetsService,
        public readonly permissionsService: PermissionsService,
    ) {
        super(service);
    }
}
