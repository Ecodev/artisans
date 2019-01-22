import {
    Component,
    ContentChild,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Optional,
    Output,
    Self,
    SimpleChanges,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { LinkMutationService } from '../../services/link-mutation.service';
import { forkJoin, Observable } from 'rxjs';

import { takeUntil } from 'rxjs/operators';
import { AbstractController } from '../AbstractController';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { QueryVariables, QueryVariablesManager } from '../../classes/query-variables-manager';
import { FetchResult } from 'apollo-link';
import { AutoRefetchQueryRef } from '../../services/abstract-model.service';
import { HierarchicConfiguration } from '../../hierarchic-selector/classes/HierarchicConfiguration';
import { HierarchicSelectorDialogService } from '../../hierarchic-selector/services/hierarchic-selector-dialog.service';
import { SelectComponent } from '../select/select.component';
import { AppDataSource } from '../../services/data.source';

/**
 * Custom template usage :
 * <app-relations [main]="owner" [service]="svc" [filter]="{}" placeholder="Select an item">
 *     <ng-template let-item="item">
 *         <span>{{ item.xxx }}</span>
 *     </ng-template>
 * </app-relations>
 */

@Component({
    selector: 'app-relations',
    templateUrl: './relations.component.html',
    styleUrls: ['./relations.component.scss'],
})
export class RelationsComponent extends AbstractController implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {

    @ViewChild(SelectComponent) select: SelectComponent;
    @ContentChild(TemplateRef) itemTemplate: TemplateRef<any>;

    @Input() service;
    @Input() placeholder;
    /**
     * Context filter for autocomplete selector
     */
    @Input() autocompleteSelectorFilter;
    /**
     * Function to customize the rendering of the selected item as text in input
     */
    @Input() displayWith: (any) => string;
    /**
     * Whether the relations can be changed
     */
    @Input() disabled: boolean;
    /**
     * Main object relations belong to
     */
    @Input() main;
    /**
     * Cause the component to work as one-to-many instead of many-to-many
     */
    @Input() value: any;
    @Output() selectionChange: EventEmitter<any> = new EventEmitter();
    /**
     * Context filters for hierarchic selector
     */
    @Input() hierarchicSelectorFilters;
    /**
     * Configuration in case we prefer hierarchic selection over autocomplete search
     */
    @Input() hierarchicSelectorConfig: HierarchicConfiguration[];
    /**
     * Provide service for autocomplete search
     */
    @Input() autocompleteSelectorService: any;
    /**
     *  Hide search field
     */
    @Input() hideSearch = false;
    /**
     * LinkMutationService uses to find the right combinations to find a matching with possible mutations
     * But in some cases it's not enough (linkEquipmentEquipment has source and target and reversing the relation is required).
     */
    @Input() reverseRelation: any;
    /**
     * Listing service instance
     */
    public dataSource: AppDataSource;
    public loading = false;
    /**
     * Table columns
     */
    public displayedColumns = [
        'name',
    ];
    public onChange;
    public onTouched;
    /**
     * Observable variables/options for listing service usage and apollo watchQuery
     */
    private variablesManager: QueryVariablesManager<QueryVariables> = new QueryVariablesManager();
    /**
     * Own auto refetchable query
     */
    private queryRef: AutoRefetchQueryRef<any>;

    constructor(private linkMutationService: LinkMutationService,
                private hierarchicSelectorDialog: HierarchicSelectorDialogService,
                @Optional() @Self() public ngControl: NgControl) {
        super();

        if (this.ngControl !== null) {
            this.ngControl.valueAccessor = this;
        }
    }

    @Input() set filter(filter) {
        this.variablesManager.merge('relations-context', {filter: filter});
    }

    ngOnInit() {

        // Force disabled if cannot update object
        if (this.main && this.main.permissions) {
            this.disabled = this.disabled || !this.main.permissions.update;
        }

        if (!this.disabled) {
            this.displayedColumns.push('unlink');
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.service) {
            this.queryItems();
        } else if (!this.service && this.value) {
            this.initItems();
        }
    }

    ngOnDestroy() {
        super.ngOnDestroy();

        if (this.queryRef) {
            this.queryRef.unsubscribe();
        }
    }

    writeValue(value) {
        this.value = value;
    }

    registerOnChange(fn) {
        this.onChange = fn;
    }

    registerOnTouched(fn) {
    }

    /**
     * TODO : replace by natural-search
     * @deprecated when natural-search is used
     */
    public search(searchTerm) {
        const filter = {filter: {groups: [{conditions: [{custom: {search: {value: searchTerm}}}]}]}};
        this.variablesManager.set('controller-variables', filter);
    }

    /**
     * Entry point to remove a relation
     * If one-to-many (with hierarchicConfiguration provided), the given value are affected
     * If many-to-many (with service provided), the link is removed
     */
    public remove(item) {
        if (this.value) {
            this.removeItem(item);
        } else {
            this.removeRelation(item);
        }
    }

    public removeItem(item) {
        const index = this.value.findIndex(i => i.id === item.id);
        const value = this.value.slice(0); // shallow copy
        value.splice(index, 1); // remove one item at specified index
        this.propagateValue(value);
    }

    /**
     * Unlink action
     * Refetch result to display it in table
     */
    public removeRelation(relation) {
        const a = !this.reverseRelation ? this.main : relation;
        const b = !this.reverseRelation ? relation : this.main;
        this.linkMutationService.unlink(a, b).subscribe(() => {
        });
    }

    public add(item) {
        if (this.value) {
            this.addItem(item);
        } else {
            this.addRelations([item]);
        }
    }

    public addItem(item) {
        const value = this.value.slice(0); // shallow copy to prevent to affect original reference
        value.push(item);
        this.propagateValue(value);
    }

    /**
     * Link action
     * Refetch result to display it in table
     * TODO : could maybe use "update" attribute of apollo.mutate function to update table faster (but hard to do it here)
     */
    public addRelations(relations: any[]) {
        const observables: Observable<FetchResult<{ id: string }>>[] = [];
        relations.forEach(relation => {
            if (!this.reverseRelation) {
                observables.push(this.linkMutationService.link(this.main, relation));
            } else {
                observables.push(this.linkMutationService.link(relation, this.main));
            }
        });

        forkJoin(observables).subscribe(() => {
            this.select.clear(true);
        });
    }

    public getDisplayFn(): (item: any) => string {
        if (this.displayWith) {
            return this.displayWith;
        }

        return (item) => item ? item.fullName || item.name : '';
    }

    public getLength(): number | null {

        if (!this.dataSource) {
            return null;
        }

        return this.dataSource.data.length;
    }

    public openHierarchicSelector() {
        const selectAtKey = this.getSelectKey();

        if (!selectAtKey) {
            return;
        }

        const selected = {};
        if (this.value) {
            selected[selectAtKey] = this.value;
        }

        this.hierarchicSelectorDialog.open(this.hierarchicSelectorConfig, true, selected, true, this.hierarchicSelectorFilters)
            .afterClosed()
            .subscribe(selection => {
                if (selection !== undefined) {
                    if (this.value) {
                        this.propagateValue(selection[selectAtKey]);
                    } else if (!this.value && selection[selectAtKey].length) {
                        this.addRelations(selection[selectAtKey]);
                    }
                }
            });
    }

    private initItems() {
        this.dataSource = new AppDataSource(this.value);
    }

    /**
     * Get list from database
     */
    private queryItems() {

        this.loading = true;
        this.queryRef = this.service.watchAll(this.variablesManager, true);

        this.dataSource = new AppDataSource(this.queryRef.valueChanges.pipe(takeUntil(this.ngUnsubscribe)));

        this.queryRef.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
            this.loading = false;
        });
    }

    private propagateValue(value) {
        this.value = value;
        this.dataSource.data = value;
        this.onChange(value); // before selectionChange to grant formControl is updated before change is effectively emitted
        this.selectionChange.emit(value);
    }

    private getSelectKey(): string | undefined {
        return this.hierarchicSelectorConfig.filter(c => !!c.selectableAtKey)[0].selectableAtKey;
    }

}
