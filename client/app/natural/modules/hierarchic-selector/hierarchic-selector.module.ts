import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HierarchicSelectorComponent } from './hierarchic-selector/hierarchic-selector.component';
import {
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTreeModule,
} from '@angular/material';
import { HierarchicSelectorDialogService } from './services/hierarchic-selector-dialog.service';
import { CdkTreeModule } from '@angular/cdk/tree';
import { FormsModule } from '@angular/forms';
import { HierarchicSelectorDialogComponent } from './hierarchic-selector-dialog/hierarchic-selector-dialog.component';
import { IconModule } from '../../components/icon/icon.module';
import { NaturalSearchModule } from '@ecodev/natural-search';

@NgModule({
    declarations: [
        HierarchicSelectorComponent,
        HierarchicSelectorDialogComponent,
    ],
    imports: [
        CommonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        FormsModule,
        MatButtonModule,
        CdkTreeModule,
        MatTreeModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        IconModule,
        MatChipsModule,
        NaturalSearchModule
    ],
    entryComponents: [
        HierarchicSelectorDialogComponent,
    ],
    providers: [
        HierarchicSelectorDialogService,
    ],
    exports: [
        HierarchicSelectorComponent,
    ],
})
export class HierarchicSelectorModule {
}
