import {Directive, OnInit} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import {
    ExtractTall,
    ExtractVall,
    Literal,
    NaturalAbstractList,
    NaturalAbstractModelService,
    PaginatedData,
    PaginationInput,
    QueryVariables,
} from '@ecodev/natural';
import {defaults, isEqual, pick} from 'lodash-es';
import {takeUntil} from 'rxjs/operators';

@Directive()
export class AbstractInfiniteLoadList<
        TService extends NaturalAbstractModelService<
            any,
            any,
            PaginatedData<Literal>,
            QueryVariables,
            any,
            any,
            any,
            any,
            any,
            any
        >,
    >
    extends NaturalAbstractList<TService>
    implements OnInit
{
    public items: ExtractTall<TService>['items'][0][] | null = null;

    public constructor(service: any) {
        super(service);
        this.persistSearch = false;
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        this.dataSource?.internalDataObservable.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
            if (!result) {
                return;
            }

            if (!this.items) {
                this.items = [];
            }

            if (result.pageIndex === 0) {
                this.items = [...result.items]; // When page index is 0, it means "new list" so replace all results.
            } else {
                this.items.push(...result.items); // Complete existing list with new items
            }
        });
    }

    public loadMore(): void {
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
    public override pagination(event: PaginationInput | PageEvent, defer?: Promise<unknown>): void {
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

        this.variablesManager.set('pagination', {pagination} as ExtractVall<TService>);

        this.persistPagination(forPersistence, defer, {fragment: 'end-of-list'});
    }
}
