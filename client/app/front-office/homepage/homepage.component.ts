import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NaturalQueryVariablesManager } from '@ecodev/natural';
import { NewsService } from '../../admin/newses/services/news.service';
import { UserService } from '../../admin/users/services/user.service';
import { Newses_newses_items, NewsesVariables, NewsSortingField, SortingOrder } from '../../shared/generated-types';
import { PermissionsService } from '../../shared/services/permissions.service';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss'],

})
export class HomepageComponent implements OnInit {

    public title = 'Les artisans de la transition';

    public viewer;

    public newses: Newses_newses_items[];

    constructor(public userService: UserService,
                private route: ActivatedRoute,
                private newsService: NewsService,
                public permissionService: PermissionsService) {
    }

    public ngOnInit(): void {
        this.viewer = this.route.snapshot.data.viewer.model;

        const qvm = new NaturalQueryVariablesManager<NewsesVariables>();
        qvm.set('variables',
            {pagination: {pageSize: 5, pageIndex: 0}, sorting: [{field: NewsSortingField.date, order: SortingOrder.DESC}]});
        this.newsService.getAll(qvm).subscribe(result => this.newses = result.items);
    }

}
