import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NaturalQueryVariablesManager} from '@ecodev/natural';
import {EventService} from '../../../admin/events/services/event.service';
import {NewsService} from '../../../admin/newses/services/news.service';
import {ProductTagService} from '../../../admin/product-tags/services/product-tag.service';
import {ProductService} from '../../../admin/products/services/product.service';
import {UserService} from '../../../admin/users/services/user.service';
import {
    CurrentUserForProfile_viewer,
    Events_events_items,
    EventSortingField,
    EventsVariables,
    Newses_newses_items,
    NewsesVariables,
    NewsSortingField,
    Products_products_items,
    ProductSortingField,
    ProductsVariables,
    SortingOrder,
} from '../../../shared/generated-types';
import {PermissionsService} from '../../../shared/services/permissions.service';
import {CartService} from '../../modules/cart/services/cart.service';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
    public title = 'Les artisans de la transition';

    public viewer: CurrentUserForProfile_viewer | null = null;

    /**
     * Last newses
     */
    public newses: Newses_newses_items[] = [];

    /**
     * Next events
     */
    public events: Events_events_items[] = [];

    /**
     * Currently active review
     */
    public currentReview: Products_products_items | null = null;

    constructor(
        public readonly userService: UserService,
        private readonly route: ActivatedRoute,
        private readonly newsService: NewsService,
        private readonly eventService: EventService,
        private readonly productService: ProductService,
        public readonly permissionService: PermissionsService,
        public readonly productTagService: ProductTagService,
        public readonly cartService: CartService,
    ) {}

    public ngOnInit(): void {
        this.viewer = this.route.snapshot.data.viewer.model;

        // News
        const qvmNews = new NaturalQueryVariablesManager<NewsesVariables>();
        qvmNews.set('variables', {
            filter: {groups: [{conditions: [{date: {less: {value: new Date()}}}]}]},
            pagination: {pageSize: 3, pageIndex: 0},
            sorting: [{field: NewsSortingField.date, order: SortingOrder.DESC}],
        });
        this.newsService.getAll(qvmNews).subscribe(result => (this.newses = result.items));

        // Events
        const qvmEvents = new NaturalQueryVariablesManager<EventsVariables>();
        qvmEvents.set('variables', {
            filter: {groups: [{conditions: [{date: {greaterOrEqual: {value: new Date()}}}]}]},
            pagination: {pageSize: 5, pageIndex: 0},
            sorting: [{field: EventSortingField.date, order: SortingOrder.ASC}],
        });
        this.eventService.getAll(qvmEvents).subscribe(result => (this.events = result.items));

        // Current active review : next product with review number and already released (and active
        const qvmProduct = new NaturalQueryVariablesManager<ProductsVariables>();
        qvmProduct.set('variables', {
            filter: {
                groups: [
                    {
                        conditions: [
                            {
                                reviewNumber: {null: {not: true}},
                                releaseDate: {lessOrEqual: {value: new Date()}},
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
