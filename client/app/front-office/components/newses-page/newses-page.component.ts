import {Component, inject} from '@angular/core';
import {NaturalCapitalizePipe, PaginationInput} from '@ecodev/natural';
import {NewsService} from '../../../admin/newses/services/news.service';
import {AbstractInfiniteLoadList} from '../../../shared/classes/AbstractInfiniteLoadList';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-newses-page',
    templateUrl: './newses-page.component.html',
    styleUrl: './newses-page.component.scss',
    standalone: true,
    imports: [CommonModule, RouterLink, MatButtonModule, NaturalCapitalizePipe],
})
export class NewsesPageComponent extends AbstractInfiniteLoadList<NewsService> {
    protected override defaultPagination: Required<PaginationInput> = {
        pageSize: 5,
        pageIndex: 0,
        offset: null,
    };

    public constructor() {
        const service = inject(NewsService);

        super(service);
    }
}
