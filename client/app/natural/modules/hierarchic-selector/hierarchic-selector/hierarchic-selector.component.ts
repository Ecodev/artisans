import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material';
import { HierarchicSelectorService, OrganizedModelSelection } from '../services/hierarchic-selector.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Observable } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatNode } from '../classes/FlatNode';
import { ModelNode } from '../classes/ModelNode';
import { HierarchicConfiguration } from '../classes/HierarchicConfiguration';
import { takeUntil } from 'rxjs/operators';
import { HierarchicFiltersConfiguration } from '../classes/HierarchicFiltersConfiguration';
import { AbstractController } from '../../../../shared/components/AbstractController';
import { Literal } from '../../../types/types';
import { Utility } from '../../../classes/Utility';
import { toGraphQLDoctrineFilter } from '@ecodev/natural-search';
import { AbstractList } from '../../../classes/AbstractList';

@Component({
    selector: 'app-hierarchic-selector',
    templateUrl: './hierarchic-selector.component.html',
    styleUrls: ['./hierarchic-selector.component.scss'],
    providers: [HierarchicSelectorService],
})
export class HierarchicSelectorComponent extends AbstractController implements OnInit, OnChanges {

    /**
     * Functions that receives a model and returns a string for display value
     */
    @Input() displayWith: (any) => string;

    /**
     * Config for items and relations arrangement
     */
    @Input() config: HierarchicConfiguration[];

    /**
     * If multiple or single item selection
     */
    @Input() multiple = false;

    @Input() selected: OrganizedModelSelection;

    /**
     * Wherever if selectable elements can be unselected
     */
    @Input() allowUnselect = true;

    /**
     * Contextual filter that apply to each query
     */
    @Input() filters: HierarchicFiltersConfiguration;

    /**
     * Inner representation of selected @Input() to allow flat listing as mat-chip.
     */
    public selectedNodes: ModelNode[];

    /**
     * Emits selection change
     * Returns a Literal where selected models are organized by key
     */
    @Output() selectionChange = new EventEmitter<OrganizedModelSelection>();

    /**
     * Controller for nodes selection
     */
    public flatNodesSelection: SelectionModel<FlatNode>;

    public treeControl: FlatTreeControl<FlatNode>;
    public treeFlattener: MatTreeFlattener<ModelNode, FlatNode>;
    public dataSource: MatTreeFlatDataSource<ModelNode, FlatNode>;

    public loading = false;

    /**
     * Cache for transformed nodes
     */
    private flatNodeMap: Map<string, FlatNode> = new Map<string, FlatNode>();

    constructor(private hierarchicSelectorService: HierarchicSelectorService) {
        super();
    }

    /**
     * Angular OnInit implementation
     */
    ngOnInit() {

        // Init tree checkbox selectors
        this.flatNodesSelection = new SelectionModel<any>(this.multiple);

        // Tree controllers and manipulators
        this.treeFlattener = new MatTreeFlattener(this.transformer(), this.getLevel(), this.isExpandable(), this.getChildren());
        this.treeControl = new FlatTreeControl<FlatNode>(this.getLevel(), this.isExpandable());

        // The dataSource contains a nested ModelNodes list. Each ModelNode has a child attribute that returns an observable.
        // The dataSource contains a flat representation of the nested ModelNodes that is generated by the treeFlattener related functions
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

        // Update dataSource when receiving new list -> we assign the whole tree
        // The treeControl and treeFlattener will generate the displayed tree
        this.hierarchicSelectorService.dataChange.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => this.dataSource.data = data);

        // Prevent empty screen on first load and init HierarchicSelectorService with inputted configuration
        this.loadRoots();

        // OrganizedSelection into list usable by template
        this.updateInnerSelection(this.selected);
    }

    /**
     * Angular OnChange implementation
     */
    ngOnChanges(changes: SimpleChanges) {
        if (changes.selected && !changes.selected.firstChange) {
            this.updateInnerSelection(this.selected);
        }

        if (changes.filters && !changes.filters.firstChange) {
            this.loadRoots();
        }
    }

    /**
     * Toggle selection of a FlatNode, considering if multiple selection is activated or not
     */
    public toggleFlatNode(flatNode: FlatNode) {

        if (this.multiple) {
            // Is multiple allowed, just toggle element
            if (this.flatNodesSelection.isSelected(flatNode)) {
                this.unselectFlatNode(flatNode);
            } else {
                this.selectFlatNode(flatNode);
            }

        } else if (!this.multiple) {
            if (this.flatNodesSelection.isSelected(flatNode)) {
                this.unselectSingleFlatNode(flatNode);
            } else {
                // If not multiple, and we want to select an element, unselect everything before to keep a single selection
                this.selectSingleFlatNode(flatNode);
            }
        }
    }

    /**
     * When unselecting an element from the mat-chips, it can be deep in the hierarchy, and the tree element may not exist...
     * ... but we still need to remove the element from the mat-chips list.
     */
    public unselectModelNode(node: ModelNode) {
        const flatNode = this.getFlatNode(node);
        if (flatNode) {
            this.unselectFlatNode(flatNode);
        } else {
            // Remove from chips list only if no flatNode, because unselectFlatNode() already deals with it.
            this.removeModelNode(node);
            this.updateSelection(this.selectedNodes);
        }
    }

    public isNodeTogglable(flatNode: FlatNode) {
        if (this.isNodeSelected(flatNode.node)) {
            return flatNode.deselectable;
        } else {
            return flatNode.selectable;
        }
    }

    public getDisplayFn(): (item: any) => string {
        if (this.displayWith) {
            return this.displayWith;
        }

        return (item) => item ? item.fullName || item.name : '';
    }

    public loadChildren(flatNode: FlatNode) {
        if (this.treeControl.isExpanded(flatNode)) {
            this.hierarchicSelectorService.loadChildren(flatNode, this.filters);
        }
    }

    public getChildren(): (node: ModelNode) => Observable<ModelNode[]> {
        return (node: ModelNode): Observable<ModelNode[]> => {
            return node.childrenChange;
        };
    }

    /**
     * Transforms a ModelNode into a FlatNode
     */
    public transformer(): (node: ModelNode, level: number) => FlatNode {
        return (node: ModelNode, level: number) => {
            return this.getOrCreateFlatNode(node, level);
        };
    }

    /**
     * Return deep of the node in the tree
     */
    public getLevel(): (node: FlatNode) => number {
        return (node: FlatNode) => {
            return node.level;
        };
    }

    /**
     * Is always expandable because we load on demand, we don't know if there are children yet
     */
    public isExpandable(): (node: FlatNode) => boolean {
        return (node: FlatNode) => {
            return node.expandable;
        };
    }

    public getOrCreateFlatNode(node: ModelNode, level: number): FlatNode {

        // Return FlatNode if exists
        const flatNode = this.getFlatNode(node);
        if (flatNode) {
            return flatNode;
        }

        // Return new FlatNode
        return this.createFlatNode(node, level);
    }

    private loadRoots(): void {
        this.loading = true;
        this.flatNodeMap = new Map<string, FlatNode>();
        this.hierarchicSelectorService.init(this.config, this.filters).subscribe(() => {
            this.loading = false;
        });
    }

    /**
     * Sync inner selection (tree and mat-chips) according to selected input attribute
     */
    private updateInnerSelection(selected: OrganizedModelSelection) {

        // Transform an OrganizedModelSelection into a ModelNode list that is used in the selected zone of the component (see template)
        this.selectedNodes = this.hierarchicSelectorService.fromOrganizedSelection(selected);

        this.flatNodesSelection.clear();
        for (const node of this.selectedNodes) {
            const flatNode = this.getFlatNode(node);
            if (flatNode) {
                this.flatNodesSelection.select(flatNode);
            }
        }
    }

    /**
     * Unselect a node, keeping the rest of the selected untouched
     */
    private unselectFlatNode(flatNode: FlatNode) {
        this.flatNodesSelection.deselect(flatNode);
        this.removeModelNode(flatNode.node);
        this.updateSelection(this.selectedNodes);
    }

    /**
     * Remove a node from chip lists
     */
    private removeModelNode(node: ModelNode) {
        const key = this.getMapKey(node.model);
        const selectionIndex = this.selectedNodes.findIndex(n => this.getMapKey(n.model) === key);
        this.selectedNodes.splice(selectionIndex, 1);
    }

    /**
     * Select a node, keeping th rest of the selected untouched
     */
    private selectFlatNode(flatNode: FlatNode) {
        this.flatNodesSelection.select(flatNode);
        this.selectedNodes.push(flatNode.node);
        this.updateSelection(this.selectedNodes);
    }

    /**
     * Clear all selected and select the given node
     */
    private selectSingleFlatNode(flatNode: FlatNode) {
        this.flatNodesSelection.clear();
        this.flatNodesSelection.select(flatNode);
        this.selectedNodes = [flatNode.node];
        this.updateSelection(this.selectedNodes);
    }

    /**
     * Clear all selected and select the given node
     */
    private unselectSingleFlatNode(flatNode: FlatNode) {
        this.flatNodesSelection.clear();
        this.selectedNodes = [];
        this.updateSelection(this.selectedNodes);
    }

    /**
     * Transform the given elements into the organized selection that is emitted to output
     */
    private updateSelection(selected) {
        const organizedFlatNodesSelection = this.hierarchicSelectorService.toOrganizedSelection(selected);
        this.selectionChange.emit(organizedFlatNodesSelection);
        Utility.replaceObjectKeepingReference(this.selected, organizedFlatNodesSelection);
    }

    private isNodeSelected(node: ModelNode): boolean {
        const key = this.getMapKey(node.model);

        return this.selectedNodes.some(n => this.getMapKey(n.model) === key);
    }

    private getFlatNode(node: ModelNode): FlatNode | null {
        const key = this.getMapKey(node.model);
        return this.flatNodeMap.get(key) || null;
    }

    private createFlatNode(node: ModelNode, level: number): FlatNode {
        const key = this.getMapKey(node.model);
        const name = this.getDisplayFn()(node.model);
        const expandable = !!node.config.childrenFilters;
        const isCustomSelectable = node.config.isSelectableCallback ? node.config.isSelectableCallback(node.model) : true;
        const isSelectable = !!node.config.selectableAtKey && isCustomSelectable;

        const flatNode = new FlatNode(node, name, level, expandable, isSelectable);

        // Mark node as selected if needed (checks the selected processed input)
        if (this.isNodeSelected(node)) {
            if (!this.allowUnselect) {
                flatNode.deselectable = false;
            }
            this.flatNodesSelection.select(flatNode);
        }

        // Cache FlatNode
        this.flatNodeMap.set(key, flatNode);

        return flatNode;
    }

    public search(selections) {
        if (AbstractList.hasSelections(selections)) {
            const filter = toGraphQLDoctrineFilter([], selections);
            const variables = {filter: filter};
            this.hierarchicSelectorService.search(variables, this.filters);
        } else {
            this.loadRoots();
        }
    }

    /**
     * Returns an identifier key for map cache
     * As many object types can be used, this function considers typename and ID to return something like document-123
     */
    private getMapKey(model: Literal): string {
        return model.__typename + '-' + model.id;
    }

}