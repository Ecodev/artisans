import { NgModule } from '@angular/core';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

const list = [
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatToolbarModule,
    MatSelectModule,
    FlexLayoutModule,
    MatListModule,
    MatMenuModule,
    MatCardModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatExpansionModule,
];

/**
 * Module to declare all Material modules to be easily
 * re-used in tests too
 */
@NgModule({
    imports: list,
    exports: list,
})
export class MaterialModule {
}
