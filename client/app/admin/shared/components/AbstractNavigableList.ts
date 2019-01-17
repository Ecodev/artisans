import { ActivatedRoute, Router } from '@angular/router';
import { OnDestroy, OnInit } from '@angular/core';
import { NaturalSearchSelections, toGraphQLDoctrineFilter } from '@ecodev/natural-search';
import { PersistenceService } from '../services/persistence.service';
import { AbstractList } from './AbstractList';
import { AbstractModelService } from '../../../shared/services/abstract-model.service';
import { AlertService } from '../../../shared/components/alert/alert.service';
import { NaturalSearchConfigurationService } from '../../../shared/natural-search/natural-search-configuration.service';
import { QueryVariables } from '../../../shared/classes/query-variables-manager';
import { CategoryFilterGroupConditionParents } from '../../../shared/generated-types';

type ParentRelationType = CategoryFilterGroupConditionParents;

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

                let parentCondition: ParentRelationType | null = null;
                if (params.parent) {

                    // parentCondition = {equal: {value: params.parent}};
                    parentCondition = {have: {values: [params.parent]}};
                    this.service.getOne(params.parent).subscribe(parent => {
                        this.breadcrumbs = this.getBreadcrumb(parent);
                    });

                    this.clearSearch();

                } else {
                    // parentCondition = {null: {not: false}};
                    parentCondition = {empty: {}};
                    this.breadcrumbs = [];
                }

                const filter: QueryVariables = {filter: {groups: [{conditions: [{parents: parentCondition}]}]}};
                this.variablesManager.set('navigation', filter);
            }
        });

        super.ngOnInit();
    }

    public clearSearch() {
        this.naturalSearchSelections = null;
        this.persistenceService.persistInStorage('ns', null, this.getStorageKey());
    }

    protected translateSearchAndRefreshList(naturalSearchSelections: NaturalSearchSelections) {

        if (this.hasSelections(naturalSearchSelections)) {
            this.variablesManager.set('navigation', null);

        } else {

            // If there is no search, restore only root elements
            this.variablesManager.set('navigation', {
                filter: {groups: [{conditions: [{parents: {empty: {}}}]}]},
            });
        }

        const translatedSelection = toGraphQLDoctrineFilter(this.naturalSearchConfig, naturalSearchSelections);
        this.variablesManager.set('natural-search', {filter: translatedSelection});
    }

    public goToChildLink(parent) {
        if (parent && parent.id) {
            return ['.', {parent: parent.id}];
        } else {
            return ['.', {}];
        }
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
