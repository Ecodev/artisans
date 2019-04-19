import { ActivatedRoute, Router } from '@angular/router';
import { Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { PageEvent, Sort } from '@angular/material';
import { fromUrl, NaturalSearchConfiguration, NaturalSearchSelections, toGraphQLDoctrineFilter, toUrl } from '@ecodev/natural-search';
import { NaturalPersistenceService } from '../services/persistence.service';
import { NaturalQueryVariablesManager, PaginationInput, QueryVariables } from './query-variable-manager';
import { NaturalAbstractController } from './abstract-controller';
import { NaturalDataSource } from './data-source';
import { NaturalSearchConfigurationService } from '../../shared/natural-search/natural-search-configuration.service';
import { NaturalAbstractModelService } from '../services/abstract-model.service';
import { NaturalAlertService } from '../modules/alert/alert.service';

/**
 * This class helps managing a list of paginated items that can be filtered,
 * selected, and then bulk actions can be performed on selection.
 *
 * Components inheriting from this class can be used as standalone with input attributes.
 *
 * Usage :
 * <natural-my-listing [contextVariables]="{filter:...}" [contextColumns]="['col1']" [persistSearch]="false">
 */
export class NaturalAbstractList<Tall, Vall extends QueryVariables> extends NaturalAbstractController implements OnInit, OnDestroy {

    /**
     * Contextual initial columns
     * By now can't by changed after initialization
     */
    @Input() contextColumns: string[];
    @Input() contextService;
    /**
     * Wherever search should be loaded from url/storage and persisted in it too.
     */
    @Input() persistSearch = true;
    /**
     * Columns list after interaction with <natural-columns-picker>
     */
    public selectedColumns: string[] = [];
    /**
     * Initial columns on component init
     */
    public initialColumns: string[];
    /**
     *
     */
    public dataSource: NaturalDataSource;
    public selection: SelectionModel<Tall>;
    public bulkActionSelected: string | null;
    public variablesManager: NaturalQueryVariablesManager<Vall> = new NaturalQueryVariablesManager<Vall>();
    public naturalSearchConfig: NaturalSearchConfiguration | null;
    public naturalSearchSelections: NaturalSearchSelections | null = [[]];
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
                protected service: NaturalAbstractModelService<any, any, Tall, Vall, any, any, any, any, any>,
                protected router: Router,
                protected route: ActivatedRoute,
                protected alertService: NaturalAlertService,
                protected persistenceService: NaturalPersistenceService,
                naturalSearchConfigurationService: NaturalSearchConfigurationService,
                private injector?: Injector) {
        super();

        // If available, get configuration for natural search
        this.naturalSearchConfig = naturalSearchConfigurationService.get(key);
    }

    /**
     * Contextual variables to apply on a list
     */
    @Input() set contextVariables(value) {
        this.variablesManager.set('contextVariables', value);
    }

    public static hasSelections(naturalSearchSelections): boolean {
        return !!naturalSearchSelections.filter(e => e.length).length; // because empty natural search return [[]]
    }

    /**
     * If change, check DocumentsComponent that overrides this function without calling super.ngOnInit().
     */
    ngOnInit() {
        this.routeData = this.route.snapshot.data;

        this.initFromContext();
        this.initFromPersisted();

        this.dataSource = new NaturalDataSource(this.getDataObservable());
        this.selection = new SelectionModel<Tall>(true, []);
    }

    /**
     * Persist search and then launch whatever is required to refresh the list
     */
    public search(naturalSearchSelections: NaturalSearchSelections) {
        if (this.persistSearch) {
            this.persistenceService.persist('ns', toUrl(naturalSearchSelections), this.route, this.getStorageKey());
        }
        this.translateSearchAndRefreshList(naturalSearchSelections);
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
        if (this.persistSearch) {
            this.persistenceService.persist('so', sorting, this.route, this.getStorageKey());
        }
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
        if (this.persistSearch) {
            this.persistenceService.persist('pa', pagination, this.route, this.getStorageKey());
        }
    }

    /**
     * Selects all rows if they are not all selected; otherwise clear selection
     */
    public masterToggle(selection: SelectionModel<Tall>, dataSource: NaturalDataSource): void {
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
    public isAllSelected(selection: SelectionModel<Tall>, dataSource: NaturalDataSource): boolean {
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

    /**
     * Initialize from routing or input context.
     * Uses data provided by router as route.data.contextXYZ
     * Uses data provided by inputs in usage <natural-xxx [contextXXX]...>
     */
    protected initFromContext() {

        // Variables
        if (this.route.snapshot.data.contextVariables) {
            this.variablesManager.set('contextVariables', this.route.snapshot.data.contextVariables);
        }

        // Columns
        if (this.contextColumns) {
            this.initialColumns = this.contextColumns;
        }

        if (this.route.snapshot.data.contextColumns) {
            this.initialColumns = this.route.snapshot.data.contextColumns;
        }

        if (!this.injector && (this.routeData.contextService || this.contextService)) {
            console.error('Injector is required to provide a context service in a component that extends AbstractListService');
        }

        // Service
        if (this.injector && this.routeData.contextService) {
            this.service = this.injector.get<any>(this.routeData.contextService);
        }

        if (this.injector && this.contextService) {
            this.service = this.injector.get<any>(this.contextService);
        }
    }

    protected getDataObservable(): Observable<Tall> {
        return this.service.watchAll(this.variablesManager, this.ngUnsubscribe);
    }

    protected initFromPersisted() {

        if (!this.persistSearch) {
            return;
        }

        const storageKey = this.getStorageKey();

        // Pagination : pa
        const pagination: QueryVariables['pagination'] = this.persistenceService.get('pa', this.route, storageKey);
        this.variablesManager.set('pagination', {pagination: pagination ? pagination : this.defaultPagination} as Vall);

        // Sorting : so
        const sorting: QueryVariables['sorting'] = this.persistenceService.get('so', this.route, storageKey) as QueryVariables['sorting'];
        this.variablesManager.set('sorting', {sorting} as Vall);

        // Natural search : ns
        this.naturalSearchSelections = fromUrl(this.persistenceService.get('ns', this.route, storageKey));
        if (NaturalAbstractList.hasSelections(this.naturalSearchSelections)) {
            this.translateSearchAndRefreshList(this.naturalSearchSelections);
        }

    }

    protected translateSearchAndRefreshList(naturalSearchSelections: NaturalSearchSelections) {
        const translatedSelection = toGraphQLDoctrineFilter(this.naturalSearchConfig, naturalSearchSelections);
        this.variablesManager.set('natural-search', {filter: translatedSelection} as Vall);
    }

    protected getStorageKey(): string {
        return 'list-' + this.key;
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

}
