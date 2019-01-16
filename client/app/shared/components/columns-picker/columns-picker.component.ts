import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    EventEmitter,
    Input,
    Output,
    QueryList,
} from '@angular/core';
import { isString, isUndefined } from 'lodash';
import { ColumnsPickerColumnDirective } from './columns-picker-column.directive';

@Component({
    selector: 'app-columns-picker',
    templateUrl: './columns-picker.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnsPickerComponent implements AfterViewInit {

    /**
     * Emit a list of column keys whenever the selection changes
     */
    @Output() selectionChange = new EventEmitter<Iterable<string>>();

    /**
     * Filter available columns
     */
    @Input() initialSelection: string[];

    @ContentChildren(ColumnsPickerColumnDirective)
    public availableColumns: QueryList<ColumnsPickerColumnDirective>;

    constructor(private changeDetectorRef: ChangeDetectorRef) {

    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.initColumns();
            this.updateColumns();
            this.changeDetectorRef.detectChanges();
        });
    }

    initColumns(): void {
        this.availableColumns.forEach(col => {
            col.show = this.initialSelection && this.initialSelection.indexOf(col.key) === -1  ? false : col.show;
        });
    }

    updateColumns(): void {
        const selectedColumns = this.availableColumns.filter(col => col.show).map(col => col.key);

        this.selectionChange.emit(selectedColumns);
    }
}
