import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NaturalHierarchicSelectorModule } from './modules/hierarchic-selector/hierarchic-selector.module';
import { SidenavModule } from './modules/sidenav/sidenav.module';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NaturalConfirmComponent } from './components/alert/confirm.component';
import { NaturalRelationsComponent } from './components/relations/relations.component';
import { NaturalDetailFixedButtonComponent } from './components/detail-fixed-button/detail-fixed-button.component';
import { NaturalFixedButtonComponent } from './components/fixed-button/fixed-button.component';
import { NaturalStampComponent } from './components/stamp/stamp.component';
import { NaturalTableButtonComponent } from './components/table-button/table-button.component';
import { NaturalCapitalizePipe } from './pipes/capitalize.pipe';
import { NaturalEnumPipe } from './pipes/enum.pipe';
import { NaturalEllipsisPipe } from './pipes/ellipsis.pipe';
import { NaturalColumnsPickerColumnDirective } from './components/columns-picker/columns-picker-column.directive';
import { NaturalColumnsPickerComponent } from './components/columns-picker/columns-picker.component';
import { NaturalSelectEnumComponent } from './components/select-enum/select-enum.component';
import { NaturalSelectComponent } from './components/select/select.component';
import { NaturalDetailHeaderComponent } from './components/detail-header/detail-header.component';
import { NaturalIconModule } from './modules/icon/icon.module';
import { IconsConfigService, NaturalIconsConfig } from './modules/icon/icon.component';

const declarationsToExport = [
    NaturalConfirmComponent,
    NaturalRelationsComponent,
    NaturalSelectComponent,
    NaturalSelectEnumComponent,
    NaturalColumnsPickerComponent,
    NaturalColumnsPickerColumnDirective,
    NaturalEllipsisPipe,
    NaturalEnumPipe,
    NaturalCapitalizePipe,
    NaturalTableButtonComponent,
    NaturalStampComponent,
    NaturalFixedButtonComponent,
    NaturalDetailFixedButtonComponent,
    NaturalDetailHeaderComponent,
];

const importsToExport = [
    NaturalHierarchicSelectorModule,
    SidenavModule,
    NaturalIconModule,
];

@NgModule({
    declarations: [
        ...declarationsToExport,
    ],
    entryComponents: [
        NaturalConfirmComponent,
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
        ...importsToExport,
    ],
})
export class NaturalModule {

    static forRoot(config: NaturalIconsConfig): ModuleWithProviders {
        return {
            ngModule: NaturalModule,
            providers: [
                {
                    provide: IconsConfigService,
                    useValue: config,
                },
            ],
        };
    }
}
