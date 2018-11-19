import { NgModule } from '@angular/core';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    MatToolbarModule,
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

/**
 * Module to declare all Material modules to be easily
 * re-used in tests too
 */
@NgModule({
    imports: [
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
    ],
    exports: [
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
    ],
})
export class AppMaterialModule {
}
