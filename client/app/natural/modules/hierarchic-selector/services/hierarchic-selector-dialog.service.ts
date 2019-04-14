import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { HierarchicSelectorDialogComponent } from '../hierarchic-selector-dialog/hierarchic-selector-dialog.component';
import { clone } from 'lodash';
import { HierarchicConfiguration } from '../classes/HierarchicConfiguration';
import { OrganizedModelSelection } from './hierarchic-selector.service';

@Injectable()
export class HierarchicSelectorDialogService {

    constructor(private dialog: MatDialog) {
    }

    public open(config: HierarchicConfiguration[],
                multiple: boolean,
                selected: OrganizedModelSelection | null = null,
                allowUnselect: boolean = true,
                filters: any = null): MatDialogRef<HierarchicSelectorDialogComponent, OrganizedModelSelection> {

        return this.dialog.open<HierarchicSelectorDialogComponent, any, OrganizedModelSelection>(HierarchicSelectorDialogComponent, {
            width: '700px',
            data: {
                config: config,
                filters: filters,
                multiple: multiple,
                selected: clone(selected), // clone prevent to affect relation in parent context, this modal should be standalone runner.
                allowUnselect: allowUnselect,
            },
        });

    }
}
