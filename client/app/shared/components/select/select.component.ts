import {
    AfterViewInit,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Optional,
    Output,
    Self,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { isObject, merge } from 'lodash';
import { distinctUntilChanged, map, sampleTime, takeUntil } from 'rxjs/operators';
import { QueryRef } from 'apollo-angular';
import { MatAutocompleteTrigger } from '@angular/material';
import { AbstractController } from '../AbstractController';
import { ExtendedFormControl } from '../../classes/ExtendedFormControl';
import { QueryVariables, QueryVariablesManager } from '../../classes/query-variables-manager';

/**
 * Default usage:
 * <app-select [service]="amazingServiceInstance" [(model)]="amazingModel" (modelChange)=amazingChangeFn($event)></app-select>
 *
 * Custom template usage :
 * <app-select [service]="svc" [(model)]="model">
 *     <ng-template let-item="item">
 *         <span>{{ item.xxx }}</span>
 *     </ng-template>
 * </app-select>
 *
 * [(model)] and (modelChange) are optional
 *
 * Placeholder :
 * <app-select placeholder="amazing placeholder">
 *
 * Never float placeholder :
 * <app-select placeholder="amazing placeholder" floatPlaceholder="never">
 *
 * Search with like %xxx% on specified attribute name instead of custom filter on whole object
 * <app-select [searchField]="string">
 *
 * Allows to input free string without selecting an option from autocomplete suggestions
 * <app-select [optionRequired]="false">
 *
 */
@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
})
export class SelectComponent extends AbstractController implements OnInit, ControlValueAccessor, AfterViewInit {

    @ViewChild(MatAutocompleteTrigger) autoTrigger: MatAutocompleteTrigger;
    @ViewChild('input') input: ElementRef;
    @ContentChild(TemplateRef) itemTemplate: TemplateRef<any>;

    /**
     * Service with watchAll function that accepts queryVariables.
     */
    @Input() service;
    @Input() placeholder: string;
    @Input() floatPlaceholder: string | null = null;
    @Input() required = false;
    @Input() optionRequired = true;

    /**
     * The filter attribute to bind when searching for a term
     */
    @Input() searchField: 'custom' | string = 'custom';

    /**
     * Whether to show the search icon
     */
    @Input() showIcon = true;
    @Input() icon = 'search';

    /**
     * Additional filter for query
     */
    @Input() filter: QueryVariables['filter'] = {};

    /**
     * Function to customize the rendering of the selected item as text in input
     */
    @Input() displayWith: (any) => string;

    /**
     * Whether the disabled can be changed
     */
    @Input() set disabled(disabled: boolean) {
        disabled ? this.formCtrl.disable() : this.formCtrl.enable();
    }

    @Input() clearBottomSpacing = false;
    @Input() clearTopSpacing = false;

    @Output() selectionChange = new EventEmitter();

    @Output() blur = new EventEmitter();

    /**
     * Items returned by server to show in listing
     */
    public items: Observable<any[]>;

    public formCtrl: FormControl = new FormControl();
    public loading = false;
    public ac;
    private queryRef: QueryRef<any>;

    /**
     * Default page size
     */
    private pageSize = 10;

    /**
     * Init search options
     */
    private variablesManager: QueryVariablesManager<QueryVariables>;

    /**
     * Number of items not shown in result list
     * Shows a message after list if positive
     */
    public moreNbItems = 0;

    /**
     * Stores the value given from parent, it's usually an object. The inner value is formCtrl.value that is a string.
     */
    private value;

    public onChange;

    constructor(@Optional() @Self() public ngControl: NgControl | null) {

        super();

        if (this.ngControl !== null) {
            this.ngControl.valueAccessor = this;
        }
    }

    ngAfterViewInit(): void {

        if (this.ngControl && this.ngControl.control) {
            if ((this.ngControl.control as ExtendedFormControl).dirtyChanges) {
                (this.ngControl.control as ExtendedFormControl).dirtyChanges.subscribe(() => {
                    this.formCtrl.markAsDirty({onlySelf: true});
                    this.formCtrl.updateValueAndValidity();
                });
            }

            this.formCtrl.setValidators(this.ngControl.control.validator);
        }

        this.formCtrl.valueChanges.pipe(takeUntil(this.ngUnsubscribe), distinctUntilChanged(), sampleTime(400)).subscribe((val) => {
            this.search(val);
            this.propagateErrors();
        });

    }

    public onInnerFormChange() {
        const value = this.formCtrl.value;
        if (value && !this.optionRequired) {
            this.propagateValue(value);
        }
    }

    writeValue(value) {
        this.value = value;
        this.formCtrl.setValue(this.getDisplayFn()(value));
    }

    registerOnChange(fn) {
        this.onChange = fn;
    }

    registerOnTouched(fn) {
    }

    ngOnInit() {

        if (!this.service) {
            return;
        }

        // Grants given service has a watchAll function/
        // TODO : Could perform better tests to grant the service accepts observable queryVariables as first paremeter
        if (typeof this.service.watchAll !== 'function') {
            throw new TypeError('Provided service does not contain watchAll function');
        }

        let variables = {
            pagination: {
                pageIndex: 0,
                pageSize: this.pageSize,
            },
        };

        variables = merge(variables, this.getSearchFilter(null));

        this.variablesManager = new QueryVariablesManager<QueryVariables>();
        this.variablesManager.set('variables', variables);
    }

    public propagateErrors() {
        if (this.ngControl && this.ngControl.control) {
            this.ngControl.control.setErrors(this.formCtrl.errors);
        }
    }

    public onFocus() {
        this.startSearch();
    }

    private getSearchFilter(term: string | null): any {
        let field = {};

        if (this.searchField === 'custom') {
            field = {custom: term ? {search: {value: term}} : null};
        } else if (term) {
            field[this.searchField] = {like: {value: '%' + term + '%'}};
        }

        return {filter: {groups: [{conditions: [field]}]}};
    }

    public startSearch() {

        if (!this.service) {
            return;
        }

        /**
         * Start search only once
         */
        if (this.queryRef) {
            return;
        }

        // Init query
        this.queryRef = this.service.watchAll(this.variablesManager);

        // When query results arrive, start loading, and count items
        this.queryRef.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((data: any) => {
            this.loading = false;
            const nbTotal = data.length;
            const nbListed = Math.min(data.length, this.pageSize);
            this.moreNbItems = nbTotal - nbListed;
        });

        this.items = this.queryRef.valueChanges.pipe(map((data: any) => data.items ? data.items : data));
    }

    public propagateValue(ev) {
        let val = ev && ev.option ? ev.option.value : ev;

        if (!this.optionRequired && val === null) {
            val = '';
        }

        this.value = val;
        this.onChange(val); // before selectionChange to grant formControl is updated before change is effectively emitted
        this.selectionChange.emit(val);
    }

    /**
     * Very important to return something, above all if [select]='displayedValue' attribute value is used
     */
    public getDisplayFn(): (item: any) => string {
        if (this.displayWith) {
            return this.displayWith;
        }

        return (item) => !item ? null : item.fullName || item.name || item[this.searchField] || item;
    }

    public clear(preventChangeValue = false) {

        this.search(null);

        // Empty input
        this.formCtrl.setValue(null);

        // propagateValue change
        if (!preventChangeValue) {
            this.propagateValue(null);
        }
    }

    public search(term) {
        if (this.service && !isObject(term)) {
            this.loading = !!this.queryRef;
            this.variablesManager.merge('additional-filter', {filter: this.filter});
            this.variablesManager.merge('variables', this.getSearchFilter(term));
        }
    }

    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

}
