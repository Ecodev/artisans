import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { clone } from 'lodash';
import { HierarchicFiltersConfiguration } from '../classes/HierarchicFiltersConfiguration';

@Component({
    selector: 'app-hierarchic-selector-dialog',
    templateUrl: './hierarchic-selector-dialog.component.html',
    styleUrls: ['./hierarchic-selector-dialog.component.scss'],
})
export class HierarchicSelectorDialogComponent implements OnInit {

    public config;
    public multiple = true;
    public allowUnselect: boolean;
    public filters: HierarchicFiltersConfiguration;

    /**
     * Given selected elements at modal opening
     */
    public selected;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<HierarchicSelectorDialogComponent>) {
        this.config = data.config;
        this.multiple = !!data.multiple;
        this.selected = data.selected;
        this.allowUnselect = data.allowUnselect !== undefined ? data.allowUnselect : true;
        this.filters = data.filters;
    }

    ngOnInit() {
    }

    public close(selected) {
        this.dialogRef.close(clone(selected));
    }

}
