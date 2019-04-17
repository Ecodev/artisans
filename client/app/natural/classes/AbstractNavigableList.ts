import { ActivatedRoute, Router } from '@angular/router';
import { OnDestroy, OnInit } from '@angular/core';
import { NaturalSearchSelections, toGraphQLDoctrineFilter } from '@ecodev/natural-search';
import { PersistenceService } from '../services/persistence.service';
import { AbstractList } from './AbstractList';
import { QueryVariables } from './QueryVariablesManager';
import { AbstractModelService } from '../services/abstract-model.service';
import { AlertService } from '../components/alert/alert.service';
import { NaturalSearchConfigurationService } from '../../shared/natural-search/natural-search-configuration.service';

/**
 * This class helps managing a list of paginated items that can be filtered,
 * selected, and then bulk actions can be performed on selection.
 */
export class AbstractNavigableList<Tall, Vall extends QueryVariables> extends AbstractList<Tall, Vall> implements OnInit, OnDestroy {

    public breadcrumbs: any[] = [];

    constructor(key: string,
                service: AbstractModelService<any, any, any, any, any, any, any, any, any>,
                router: Router,
                route: ActivatedRoute,
                alertService: AlertService,
                persistenceService: PersistenceService,
                naturalSearchConfigurationService: NaturalSearchConfigurationService) {

        super(key, service, router, route, alertService, persistenceService, naturalSearchConfigurationService);

        // If available, get configuration for natural search
        this.naturalSearchConfig = naturalSearchConfigurationService.get(key);
    }

    ngOnInit(): void {

        this.route.params.subscribe((params: any) => {

            // "ns" stands for natural-search to be shorter in url
            if (!params['ns']) {

                let parentCondition: any | null = null;
                if (params.parent) {

                    // parentCondition = {equal: {value: params.parent}}; // todo : remove if everything ok with bellow version
                    parentCondition = {have: {values: [params.parent]}};
                    this.service.getOne(params.parent).subscribe(parent => {
                        this.breadcrumbs = this.getBreadcrumb(parent);
                    });

                    this.clearSearch();

                } else {
                    // parentCondition = {null: {}}; // todo : remove if everything ok with bellow version
                    parentCondition = {empty: {}};
                    this.breadcrumbs = [];
                }

                const filter: QueryVariables = {filter: {groups: [{conditions: [{parent: parentCondition}]}]}};

                // todo : check why without "as Vall" it errors. Vall is supposed to be QueryVariables, and filter too.
                this.variablesManager.set('navigation', filter as Vall);
            }
        });

        super.ngOnInit();
    }

    public clearSearch() {
        this.naturalSearchSelections = null;
        this.persistenceService.persistInStorage('ns', null, this.getStorageKey());
    }

    public goToChildLink(parent) {
        if (parent && parent.id) {
            return ['.', {parent: parent.id}];
        } else {
            return ['.', {}];
        }
    }

    protected translateSearchAndRefreshList(naturalSearchSelections: NaturalSearchSelections) {

        if (AbstractList.hasSelections(naturalSearchSelections)) {
            this.variablesManager.set('navigation', null);

        } else {

            // If there is no search, restore only root elements
            this.variablesManager.set('navigation', {
                filter: {groups: [{conditions: [{parent: {empty: {}}}]}]},
            } as Vall);
            // todo : check why without "as Vall" it errors. Vall is supposed to be QueryVariables, and filter too.
        }

        const translatedSelection = toGraphQLDoctrineFilter(this.naturalSearchConfig, naturalSearchSelections);

        // todo : check why without "as Vall" it errors.  Vall is supposed to be QueryVariables, and filter too.
        this.variablesManager.set('natural-search', {filter: translatedSelection} as Vall);
    }

    /**
     * Deep is limited by queries
     * @param item with a parenting relation
     */
    protected getBreadcrumb(item: { parent, name }): { name }[] {
        if (item.parent) {
            return this.getBreadcrumb(item.parent).concat([item]);
        }

        return [item];
    }

}
