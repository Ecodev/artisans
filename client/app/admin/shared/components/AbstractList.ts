import { ActivatedRoute, Router } from '@angular/router';
import { OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { takeUntil } from 'rxjs/operators';
import { PageEvent, Sort } from '@angular/material';
import { fromUrl, NaturalSearchConfiguration, NaturalSearchSelections, toGraphQLDoctrineFilter, toUrl } from '@ecodev/natural-search';
import { PersistenceService } from '../services/persistence.service';
import { AbstractController } from '../../../shared/components/AbstractController';
import { PaginatedDataSource } from '../../../shared/services/paginated.data.source';
import { AbstractModelService, AutoRefetchQueryRef } from '../../../shared/services/abstract-model.service';
import { QueryVariables, QueryVariablesManager } from '../../../shared/classes/query-variables-manager';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { NaturalSearchConfigurationService } from '../../../shared/natural-search/natural-search-configuration.service';
import { PaginationInput } from '../../../shared/generated-types';

/**
 * This class helps managing a list of paginated items that can be filtered,
 * selected, and then bulk actions can be performed on selection.
 */
export class AbstractList<Tall, Vall extends QueryVariables> extends AbstractController implements OnInit, OnDestroy {

    public selectedColumns: string[] = [];
    public dataSource: PaginatedDataSource;
    public selection: SelectionModel<Tall>;
    public bulkActionSelected: string | null;

    public variablesManager: QueryVariablesManager<Vall> = new QueryVariablesManager<Vall>();

    protected queryRef: AutoRefetchQueryRef<Tall>;

    public naturalSearchConfig: NaturalSearchConfiguration | null;

    public naturalSearchSelections: NaturalSearchSelections = [[]];

    public routeData;

    /**
     * List of pagination options
     */
    public readonly pageSizeOptions = [
        5,
        10,
        25,
        50,
        100,
        200,
    ];

    protected defaultPagination: PaginationInput = {
        pageIndex: 0,
        pageSize: 25,
    };

    constructor(protected key: string,
                protected service: AbstractModelService<any, any, Tall, Vall, any, any, any, any, any>,
                protected router: Router,
                protected route: ActivatedRoute,
                protected alertService: AlertService,
                protected persistenceService: PersistenceService,
                naturalSearchConfigurationService: NaturalSearchConfigurationService) {
        super();

        // If available, get configuration for natural search
        this.naturalSearchConfig = naturalSearchConfigurationService.get(key);
    }

    /**
     * If change, check DocumentsComponent that overrides this function without calling super.ngOnInit().
     */
    ngOnInit() {
        this.initFromPersisted();

        this.routeData = this.route.snapshot.data;

        if (this.route.snapshot.data.routeFilter) {
            this.variablesManager.set('routeFilters', this.route.snapshot.data.routeFilter);
        }

        this.dataSource = new PaginatedDataSource(this.getDataObservable(), this.variablesManager);
        this.selection = new SelectionModel<Tall>(true, []);
    }

    protected getDataObservable(): Observable<Tall> {
        this.queryRef = this.service.watchAll(this.variablesManager, true);
        return this.queryRef.valueChanges.pipe(takeUntil(this.ngUnsubscribe));
    }

    protected initFromPersisted() {

        const storageKey = this.getStorageKey();

        // Pagination : pa
        const pagination: QueryVariables['pagination'] = this.persistenceService.get('pa', this.route, storageKey);
        this.variablesManager.set('pagination', {pagination: pagination ? pagination : this.defaultPagination} as Vall);

        // Sorting : so
        const sorting: QueryVariables['sorting'] = this.persistenceService.get('so', this.route, storageKey) as QueryVariables['sorting'];
        this.variablesManager.set('sorting', {sorting} as Vall);

        // Natural search : ns
        this.naturalSearchSelections = fromUrl(this.persistenceService.get('ns', this.route, storageKey));
        if (this.hasSelections(this.naturalSearchSelections)) {
            this.translateSearchAndRefreshList(this.naturalSearchSelections);
        }

    }

    ngOnDestroy() {
        super.ngOnDestroy();

        if (this.queryRef) {
            this.queryRef.unsubscribe();
        }
    }

    /**
     * Persist search and then launch whatever is required to refresh the list
     */
    public search(naturalSearchSelections: NaturalSearchSelections) {
        this.persistenceService.persist('ns', toUrl(naturalSearchSelections), this.route, this.getStorageKey());
        this.translateSearchAndRefreshList(naturalSearchSelections);
    }

    protected translateSearchAndRefreshList(naturalSearchSelections: NaturalSearchSelections) {
        const translatedSelection = toGraphQLDoctrineFilter(this.naturalSearchConfig, naturalSearchSelections);
        this.variablesManager.set('natural-search', {filter: translatedSelection} as Vall);
    }

    public sorting(event: Sort) {
        let sorting: QueryVariables['sorting'] | null = null;
        if (event.direction) {
            sorting = [
                {
                    field: event.active,
                    order: event.direction.toUpperCase(),
                },
                // Always sort by ID to guarantee predictable sort in case of collision on the other column
                {
                    field: 'id',
                    order: 'ASC',
                },
            ] as QueryVariables['sorting'];
        }

        this.variablesManager.set('sorting', {sorting} as Vall);
        this.persistenceService.persist('so', sorting, this.route, this.getStorageKey());
    }

    public pagination(event: PageEvent) {

        let pagination: QueryVariables['pagination'] = null;
        if (event.pageIndex !== this.defaultPagination.pageIndex || event.pageSize !== this.defaultPagination.pageSize) {
            pagination = {
                pageIndex: event.pageIndex,
                pageSize: event.pageSize,
            };
        }

        this.variablesManager.merge('pagination', {pagination: pagination ? pagination : this.defaultPagination} as Vall);
        this.persistenceService.persist('pa', pagination, this.route, this.getStorageKey());
    }

    protected getStorageKey() {
        return 'list-' + this.key;
    }

    /**
     * Selects all rows if they are not all selected; otherwise clear selection
     */
    public masterToggle(selection: SelectionModel<Tall>, dataSource: PaginatedDataSource): void {
        if (this.isAllSelected(selection, dataSource)) {
            selection.clear();
        } else {

            if (dataSource.data) {
                dataSource.data.forEach(row => {
                    if (row.id) {
                        selection.select(row);
                    }
                });
            }
        }
    }

    /**
     * Whether the number of selected elements matches the total number of rows
     */
    public isAllSelected(selection: SelectionModel<Tall>, dataSource: PaginatedDataSource): boolean {
        const numSelected = selection.selected.length;
        let numRows = 0;
        if (dataSource.data) {
            dataSource.data.forEach(row => {
                if (row.id) {
                    numRows++;
                }
            });
        }

        return numSelected === numRows;
    }

    /**
     * Called when a bulk action is selected
     */
    public bulkAction(): void {
        if (!this.bulkActionSelected || this.bulkActionSelected && !this[this.bulkActionSelected]) {
            throw new Error('Trying to execute a bulk that does not exist: ' + this.bulkActionSelected);
        }

        this[this.bulkActionSelected]();
    }

    protected bulkdDeleteConfirmation(): Observable<any> {
        return this.alertService.confirm(
            'Suppression',
            'Voulez-vous supprimer définitivement les éléments sélectionnés ?',
            'Supprimer définitivement',
        );
    }

    /**
     * Delete multiple items at once
     */
    protected bulkDelete(): Subject<any> {
        const subject = new Subject();
        this.bulkdDeleteConfirmation().subscribe(confirmed => {
            this.bulkActionSelected = null;
            if (confirmed) {
                this.service.delete(this.selection.selected as any).subscribe(() => {
                    this.selection.clear();
                    this.alertService.info('Supprimé');
                    subject.next('');
                });
            }
        });

        return subject;
    }

    protected hasSelections(naturalSearchSelections): boolean {
        return !!naturalSearchSelections.filter(e => e.length).length; // because empty natural search return [[]]
    }
}
