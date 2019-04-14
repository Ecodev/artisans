import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from './components/alert/confirm.component';
import { IconModule } from './components/icon/icon.module';
import { HierarchicSelectorModule } from './modules/hierarchic-selector/hierarchic-selector.module';
import { TableButtonComponent } from './components/table-button/table-button.component';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { EnumPipe } from './pipes/enum.pipe';
import { EllipsisPipe } from './pipes/ellipsis.pipe';
import { DetailFixedButtonComponent } from './components/detail-fixed-button/detail-fixed-button.component';
import { ColumnsPickerColumnDirective } from './components/columns-picker/columns-picker-column.directive';
import { ColumnsPickerComponent } from './components/columns-picker/columns-picker.component';
import { SelectEnumComponent } from './components/select-enum/select-enum.component';
import { SelectComponent } from './components/select/select.component';
import { RelationsComponent } from './components/relations/relations.component';
import { StampComponent } from './components/stamp/stamp.component';
import { SidenavModule } from './modules/sidenav/sidenav.module';
import { MaterialModule } from './material.module';
import { FixedButtonComponent } from './components/fixed-button/fixed-button.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

const declarationsToExport = [
    ConfirmComponent,
    RelationsComponent,
    SelectComponent,
    SelectEnumComponent,
    ColumnsPickerComponent,
    ColumnsPickerColumnDirective,
    EllipsisPipe,
    EnumPipe,
    CapitalizePipe,
    TableButtonComponent,
    StampComponent,
    FixedButtonComponent,
    DetailFixedButtonComponent,
];

const importsToExport = [
    HierarchicSelectorModule,
    SidenavModule,
    IconModule,
];

@NgModule({
    declarations: [
        ...declarationsToExport,
    ],
    entryComponents: [
        ConfirmComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        ...importsToExport,
    ],
    exports: [
        ...declarationsToExport,
        ...importsToExport
    ],
})
export class NaturalModule {
}
