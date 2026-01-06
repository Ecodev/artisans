import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {
    formatIsoDate,
    formatIsoDateTime,
    NaturalCapitalizePipe,
    NaturalIconDirective,
    NaturalQueryVariablesManager,
    NaturalSrcDensityDirective,
} from '@ecodev/natural';
import {EventService} from '../../../admin/events/services/event.service';
import {NewsService} from '../../../admin/newses/services/news.service';
import {ProductService} from '../../../admin/products/services/product.service';
import {UserService} from '../../../admin/users/services/user.service';
import {
    CurrentUserForProfileQuery,
    EventSortingField,
    EventsQuery,
    EventsQueryVariables,
    NewsesQuery,
    NewsesQueryVariables,
    NewsSortingField,
    ProductSortingField,
    ProductsQuery,
    ProductsQueryVariables,
    SortingOrder,
} from '../../../shared/generated-types';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {TagsNavigationComponent} from '../../../shared/components/tags-navigation/tags-navigation.component';
import {PriceComponent} from '../../../shared/components/price/price.component';
import {MatRipple} from '@angular/material/core';
import {MatDivider} from '@angular/material/divider';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatFabButton} from '@angular/material/button';
import {AsyncPipe, DatePipe} from '@angular/common';
import {HomeBlockComponent} from '../home-block/home-block.component';

@Component({
    selector: 'app-homepage',
    imports: [
        HomeBlockComponent,
        AsyncPipe,
        DatePipe,
        MatButton,
        MatFabButton,
        RouterLink,
        MatIcon,
        NaturalIconDirective,
        MatDivider,
        MatRipple,
        NaturalSrcDensityDirective,
        PriceComponent,
        TagsNavigationComponent,
        NaturalCapitalizePipe,
    ],
    templateUrl: './homepage.component.html',
    styleUrl: './homepage.component.scss',
})
export class HomepageComponent implements OnInit {
    protected readonly userService = inject(UserService);
    private readonly route = inject(ActivatedRoute);
    private readonly newsService = inject(NewsService);
    private readonly eventService = inject(EventService);
    private readonly productService = inject(ProductService);
    protected readonly permissionsService = inject(PermissionsService);

    protected title = 'Les artisans de la transition';

    protected viewer: CurrentUserForProfileQuery['viewer'] = null;

    /**
     * Last newses
     */
    protected newses: NewsesQuery['newses']['items'][0][] = [];

    /**
     * Next events
     */
    protected events: EventsQuery['events']['items'][0][] = [];

    /**
     * Currently active review
     */
    protected currentReview: ProductsQuery['products']['items'][0] | null = null;

    public ngOnInit(): void {
        this.viewer = this.route.snapshot.data.viewer;

        // News
        const qvmNews = new NaturalQueryVariablesManager<NewsesQueryVariables>();
        qvmNews.set('variables', {
            filter: {
                groups: [
                    {
                        conditions: [
                            {
                                date: {less: {value: formatIsoDateTime(new Date())}},
                                isActive: {equal: {value: true}},
                            },
                        ],
                    },
                ],
            },
            pagination: {pageSize: 3, pageIndex: 0},
            sorting: [{field: NewsSortingField.date, order: SortingOrder.DESC}],
        });
        this.newsService.getAll(qvmNews).subscribe(result => (this.newses = result.items));

        // Events
        const qvmEvents = new NaturalQueryVariablesManager<EventsQueryVariables>();
        qvmEvents.set('variables', {
            filter: {groups: [{conditions: [{date: {greaterOrEqual: {value: formatIsoDate(new Date())}}}]}]},
            pagination: {pageSize: 5, pageIndex: 0},
            sorting: [{field: EventSortingField.date, order: SortingOrder.ASC}],
        });
        this.eventService.getAll(qvmEvents).subscribe(result => (this.events = result.items));

        // Current active review : next product with review number and already released (and active
        const qvmProduct = new NaturalQueryVariablesManager<ProductsQueryVariables>();
        qvmProduct.set('variables', {
            filter: {
                groups: [
                    {
                        conditions: [
                            {
                                reviewNumber: {null: {not: true}},
                                releaseDate: {lessOrEqual: {value: formatIsoDateTime(new Date())}},
                                isActive: {equal: {value: true}},
                            },
                        ],
                    },
                ],
            },
            pagination: {pageSize: 1, pageIndex: 0},
            sorting: [{field: ProductSortingField.releaseDate, order: SortingOrder.DESC}],
        });
        this.productService.getAll(qvmProduct).subscribe(result => (this.currentReview = result.items[0]));
    }
}
