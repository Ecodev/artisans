import { NgModule } from '@angular/core';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
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
    MatSidenavModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatRippleModule,
];

/**
 * Module to declare all Material modules to be easily
 * re-used in tests too
 */
@NgModule({
    imports: [...list],
    exports: [...list],
})
export class MaterialModule {
}
