import { Directive } from '@angular/core';
import { Input } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { ElementRef } from '@angular/core';
import { OnInit } from '@angular/core';

@Directive({
    selector: '[appColumnsPickerColumn]',
})
export class ColumnsPickerColumnDirective implements AfterViewInit, OnInit {
    /**
     * This must be the column key as defined in matColumnDef
     */
    @Input()
    set appColumnsPickerColumn(value: string) {
        this.key = value;
    }

    key: string;

    /**
     * Initial visibility state
     */
    @Input() show = true;

    /**
     * Localized label of column, if absent default to key
     */
    label: string;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit(): void {
        // Default label to key before real label is accessible
        this.label = this.key;
    }

    ngAfterViewInit(): void {
        this.label = this.elementRef.nativeElement.textContent;
    }
}
