import { NgModule } from '@angular/core';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    MatToolbarModule,
} from '@angular/material';

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
    ],
})
export class AppMaterialModule {
}
