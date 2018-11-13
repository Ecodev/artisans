import { NgModule } from '@angular/core';
import {
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTableModule,
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
    ],
    exports: [
        MatButtonModule,
        MatCheckboxModule,
        MatDialogModule,
        MatSnackBarModule,
        MatTableModule,
    ],
})
export class AppMaterialModule {
}
