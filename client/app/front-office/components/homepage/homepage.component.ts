import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NaturalQueryVariablesManager } from '@ecodev/natural';
import { EventService } from '../../../admin/events/services/event.service';
import { NewsService } from '../../../admin/newses/services/news.service';
import { UserService } from '../../../admin/users/services/user.service';
import { PermissionsService } from '../../../shared/services/permissions.service';
import {
    Events_events_items,
    EventSortingField,
    EventsVariables,
    Newses_newses_items,
    NewsesVariables,
    NewsSortingField,
    SortingOrder,
} from '../../../shared/generated-types';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss'],

})
export class HomepageComponent implements OnInit {

    public title = 'Les artisans de la transition';

    public viewer;

    public newses: Newses_newses_items[];
    public events: Events_events_items[];

    constructor(public userService: UserService,
                private route: ActivatedRoute,
                private newsService: NewsService,
                private eventService: EventService,
                public permissionService: PermissionsService) {
    }

    public ngOnInit(): void {
        this.viewer = this.route.snapshot.data.viewer.model;

        // News
        const qvmNews = new NaturalQueryVariablesManager<NewsesVariables>();
        qvmNews.set('variables', {
            pagination: {pageSize: 5, pageIndex: 0},
            sorting: [{field: NewsSortingField.date, order: SortingOrder.DESC}],
        });
        this.newsService.getAll(qvmNews).subscribe(result => this.newses = result.items);

        // Events
        const qvmEvents = new NaturalQueryVariablesManager<EventsVariables>();
        qvmEvents.set('variables', {
            pagination: {pageSize: 5, pageIndex: 0},
            sorting: [{field: EventSortingField.date, order: SortingOrder.DESC}],
        });
        this.eventService.getAll(qvmEvents).subscribe(result => this.events = result.items);
    }

}
