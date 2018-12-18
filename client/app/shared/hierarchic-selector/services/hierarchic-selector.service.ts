import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { intersection } from 'lodash';
import { FlatNode } from '../classes/FlatNode';
import { ModelNode } from '../classes/ModelNode';
import { HierarchicConfiguration } from '../classes/HierarchicConfiguration';
import { HierarchicFilterConfiguration, HierarchicFiltersConfiguration } from '../classes/HierarchicFiltersConfiguration';
import { QueryVariablesManager } from '../../classes/query-variables-manager';

export interface OrganizedModelSelection {
    [key: string]: any[];
}

@Injectable()
export class HierarchicSelectorService {

    /**
     * Stores the global result of the tree
     * This observable contains Node.
     * When it's updated, the TreeController and TreeFlattener process the new array to generate the flat tree.
     */
    dataChange: BehaviorSubject<ModelNode[]> = new BehaviorSubject<ModelNode[]>([]);

    /**
     * Configuration for relations and selection constraints
     */
    private configuration: HierarchicConfiguration[];

    constructor(private injector: Injector) {
    }

    /**
     * Init component by saving the complete configuration, and then retrieving root elements.
     * Updates **another** observable (this.dataChange) when data is retrieved.
     */
    public init(config: HierarchicConfiguration[], contextFilter: HierarchicFiltersConfiguration | null = null): Observable<any> {

        this.validateConfiguration(config);
        this.configuration = this.injectServicesInConfiguration(config);

        return this.getList(null, contextFilter).pipe(map((data: any) => {
            this.dataChange.next(data);
            return data;
        }));
    }

    private injectServicesInConfiguration(configurations): HierarchicConfiguration[] {

        for (const config of configurations) {
            if (!config.injectedService) {
                config.injectedService = this.injector.get(config.service);
            }
        }

        return configurations;
    }

    /**
     * Checks that each configuration.selectableAtKey attribute is unique
     */
    private validateConfiguration(configurations: HierarchicConfiguration[]) {
        const selectableAtKeyAttributes: string[] = [];
        for (const config of configurations) {

            if (config.selectableAtKey) {
                const keyIndex = selectableAtKeyAttributes.indexOf(config.selectableAtKey);

                if (keyIndex === -1 && config.selectableAtKey) {
                    selectableAtKeyAttributes.push(config.selectableAtKey);
                }

                // TODO : remove ?
                // This behavior maybe dangerous in case we re-open hierarchical selector with the last returned config having non-unique
                // keys
                if (keyIndex < -1) {
                    console.warn('Invalid hierarchic configuration : selectableAtKey attribute should be unique');
                }
            }

        }
    }

    /**
     * Get list of children, considering given FlatNode id as a parent.
     * Mark loading status individually on nodes.
     */
    public loadChildren(flatNode: FlatNode, contextFilter: HierarchicFiltersConfiguration | null = null) {
        flatNode.loading = true;
        this.getList(flatNode, contextFilter).subscribe(items => {
            flatNode.node.childrenChange.next(items);
            this.dataChange.next(this.dataChange.getValue());
            flatNode.loading = false;
        });
    }

    /**
     * Retrieve elements from the server
     * Get root elements if node is null, or child elements if node is given
     */
    public getList(node: FlatNode | null = null, contextFilters: HierarchicFiltersConfiguration | null = null): Observable<any> {

        const configurations: HierarchicConfiguration[] = [];
        const observables: Observable<any>[] = [];

        // Considering the whole configuration may cause queries with no/wrong results we have imperatively to avoid !
        // e.g there are cross dependencies between equipments and taxonomies filters. Both have "parents" and "taxonomies" filters...
        // When clicking on a equipment, the configuration of taxonomies with match "parents" filter, but use the id of the equipment
        // To fix this, we should only consider configuration after the one given by the node passed as argument.
        // That would mean : no child can affect parent.
        // That would mean : sorting in the configuration have semantic/hierarchy implications
        const configs = node ? this.getNextConfigs(node.node.config) : this.configuration;

        const pagination = {
            pageIndex: 0,
            pageSize: 999,
        };

        for (const config of configs) {
            const contextFilter = this.getServiceContextFilter(config, contextFilters);
            const filter = this.getServiceFilter(node, config, contextFilter);
            if (filter && config.injectedService) {
                configurations.push(config);
                const variablesManager = new QueryVariablesManager();

                variablesManager.set('variables', {
                    filter: filter,
                    pagination: pagination,
                });

                variablesManager.set('config-filter', {
                    filter: config.filter,
                });

                observables.push(config.injectedService.getAll(variablesManager));
            }
        }

        // Fire queries, and merge results, transforming apollo items into Node Object.
        return forkJoin(observables).pipe(map((results: any) => {
            const listing: ModelNode[] = [];

            const totalItems = results.reduce((stack, val) => stack + val.items.length, 0);
            if (totalItems === 0 && node) {
                node.expandable = false;
            }

            // For each result of an observable
            for (let i = 0; i < results.length; i++) {

                // For each item of the result, convert into Node object
                for (let j = 0; j < results[i].items.length; j++) {
                    listing.push(new ModelNode(results[i].items[j], configurations[i]));
                }
            }

            return listing;
        }));
    }

    /**
     * Return a list of configuration from the given one until the end of configurations list
     */
    private getNextConfigs(config) {
        const configIndex = this.configuration.findIndex(c => c === config);
        return this.configuration.slice(configIndex);
    }

    /**
     * Builds queryVariables filter for children query
     */
    private getServiceFilter(flatNode: FlatNode | null,
                             config: HierarchicConfiguration,
                             contextFilter: HierarchicFilterConfiguration['filter'] | null = null,
    ): HierarchicFilterConfiguration['filter'] | null {

        const fieldCondition = {};

        // if no parent, filter empty elements
        if (!flatNode) {

            if (!config.parentsFilters) {
                return contextFilter ? contextFilter : {};
            }

            config.parentsFilters.forEach(f => {
                fieldCondition[f] = {empty: {not: false}};
            });

        } else {
            const matchingFilters = intersection(flatNode.node.config.childrenFilters, config.parentsFilters);
            if (!matchingFilters.length) {
                return null;
            }
            fieldCondition[matchingFilters[0]] = {have: {values: [flatNode.node.model.id]}};
        }

        const filters = {
            groups: [
                {
                    conditions: [fieldCondition],
                },
            ],
        };

        if (contextFilter) {
            filters.groups.push(...contextFilter.groups);
        }

        return filters;
    }

    private getServiceContextFilter(config: HierarchicConfiguration,
                                    contextFilters: HierarchicFilterConfiguration[] | null,
    ): HierarchicFilterConfiguration['filter'] | null {

        if (!contextFilters || !config) {
            return null;
        }

        const filter = contextFilters.find((f) => f.service === config.service);
        return filter ? filter.filter : null;
    }

    /**
     * Check configuration to return a boolean that allows or denies the selection for the given element
     */
    public isSelectable(node: FlatNode): boolean {
        return !!node.node.config.selectableAtKey;
    }

    /**
     * Return models matching given FlatNodes
     * Returns a Literal of models grouped by their configuration attribute "selectableAtKey"
     */
    public toOrganizedSelection(nodes: ModelNode[]): OrganizedModelSelection {

        const selection = this.configuration.reduce((group, config) => {
            if (config.selectableAtKey) {
                group[config.selectableAtKey] = [];
            }
            return group;
        }, {});

        for (const node of nodes) {
            if (node.config.selectableAtKey) {
                selection[node.config.selectableAtKey].push(node.model);
            }
        }

        return selection;
    }

    /**
     * Transforms an OrganizedModelSelection into a list of ModelNodes
     */
    public fromOrganizedSelection(organizedModelSelection: OrganizedModelSelection): ModelNode[] {

        if (!organizedModelSelection) {
            return [];
        }

        const result: ModelNode[] = [];
        for (const selectableAtKey of Object.keys(organizedModelSelection)) {
            const config = this.getConfigurationBySelectableKey(selectableAtKey);
            if (config) {
                for (const model of organizedModelSelection[selectableAtKey]) {
                    result.push(new ModelNode(model, config));
                }
            }
        }
        return result;
    }

    /**
     * Search in configurations.selectableAtKey attribute to find given key and return the configuration
     */
    private getConfigurationBySelectableKey(key: HierarchicConfiguration['selectableAtKey']): HierarchicConfiguration | null {

        if (!this.configuration) {
            return null;
        }

        return this.configuration.find(conf => conf.selectableAtKey === key) || null;
    }

}
