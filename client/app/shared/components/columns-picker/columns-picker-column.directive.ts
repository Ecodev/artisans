import { AfterViewInit, Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[appColumnsPickerColumn]',
})
export class ColumnsPickerColumnDirective implements AfterViewInit, OnInit {
    key: string;

    /**
     * Initial checked state
     */
    @Input() checked = true;

    /**
     * Initial visibility state
     */
    @Input() hidden = false;

    /**
     * Localized label of column, if absent default to key
     */
    label: string;

    constructor(private elementRef: ElementRef) {
    }

    /**
     * This must be the column key as defined in matColumnDef
     */
    @Input()
    set appColumnsPickerColumn(value: string) {
        this.key = value;
    }

    ngOnInit(): void {
        // Default label to key before real label is accessible
        this.label = this.key;
    }

    ngAfterViewInit(): void {
        this.label = this.elementRef.nativeElement.textContent;
    }
}
