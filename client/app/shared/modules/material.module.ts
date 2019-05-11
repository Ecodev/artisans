import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
    DateAdapter,
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
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
} from '@angular/material';
import { SwissParsingDateAdapter } from '../services/swiss-parsing-date-adapter.service';

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
    MatSortModule,
    MatSliderModule,
];

/**
 * Module to declare all Material modules to be easily
 * re-used in tests too
 */
@NgModule({
    imports: [...list],
    exports: [...list],
    providers: [
        {
            provide: DateAdapter,
            useClass: SwissParsingDateAdapter,
        },
    ],
})
export class MaterialModule {
}
