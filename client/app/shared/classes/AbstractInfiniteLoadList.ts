// tslint:disable:directive-class-suffix
import {Injector, OnInit, Directive} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {NaturalAbstractList, PaginatedData, PaginationInput, QueryVariables} from '@ecodev/natural';
import {defaults, isEqual, pick} from 'lodash-es';
import {takeUntil} from 'rxjs/operators';

@Directive()
export class AbstractInfiniteLoadList<Tall extends PaginatedData<any>, Vall extends QueryVariables>
    extends NaturalAbstractList<Tall, Vall>
    implements OnInit {
    public items: Tall['items'] = [];

    constructor(service: any, injector: Injector) {
        super(service, injector);
        // this.persistSearch = false;
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.dataSource?.internalDataObservable.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
            if (!result) {
                return;
            }

            if (result.pageIndex === 0) {
                this.items = [...result.items]; // When page index is 0, it means "new list" so replace all results.
            } else {
                this.items.push(...result.items); // Complete existing list with new items
            }
        });
    }

    public loadMore() {
        if (this.dataSource?.data) {
            this.pagination({pageIndex: this.dataSource.data.pageIndex + 1});
        }
    }

    /**
     * Override parent function to deal with the "load more" mechanism. When the user load more pages, the url
     * parameters refers to what is required to show the entire page result. If good for SEO purposes and
     * reload/sharing pages.
     *
     * For example : With pageSize:5 and 3 more loaded pages(= 15 items ), the persisted parameters show pageIndex:0
     * and pageSize: 15
     *
     * Todo : could be improved to restore default pageSize:5 after initialisation otherwise pageSize:15 will apply for
     * further paginations
     */
    public pagination(event: PaginationInput | PageEvent, defer?: Promise<unknown>): void {
        let pagination: PaginationInput = this.defaultPagination;
        let forPersistence: PaginationInput | null = null;

        // Convert to natural/graphql format, adding missing attributes
        let naturalEvent: PaginationInput = pick(event, Object.keys(this.defaultPagination)); // object with only PaginationInput attributes
        naturalEvent = defaults(naturalEvent, this.defaultPagination); // Default with controller values

        if (!isEqual(naturalEvent, this.defaultPagination)) {
            pagination = naturalEvent;

            if (pagination && pagination.pageSize && pagination.pageIndex) {
                forPersistence = {
                    offset: null,
                    pageSize: pagination.pageSize * (pagination.pageIndex + 1),
                    pageIndex: 0,
                };
            }
        }

        this.variablesManager.set('pagination', {pagination} as Vall);

        this.persistPagination(forPersistence, defer, {fragment: 'end-of-list'});
    }
}
