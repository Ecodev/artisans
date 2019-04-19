import { ModuleWithProviders, NgModule } from '@angular/core';
import { NaturalHierarchicSelectorModule } from './modules/hierarchic-selector/hierarchic-selector.module';
import { NaturalSidenavModule } from './modules/sidenav/sidenav.module';
import { NaturalIconModule } from './modules/icon/icon.module';
import { IconsConfigService, NaturalIconsConfig } from './modules/icon/icon.component';
import { NaturalSelectModule } from './modules/select/select.module';
import { NaturalRelationsModule } from './modules/relations/relations.module';
import { NaturalAlertModule } from './modules/alert/alert.module';
import { NaturalColumnsPickerModule } from './modules/columns-picker/columns-picker.module';
import { NaturalFixedButtonModule } from './modules/fixed-button/fixed-button.module';
import { NaturalSelectEnumModule } from './modules/select-enum/select-enum.module';
import { NaturalStampModule } from './modules/stamp/stamp-module.module';
import { NaturalTableButtonModule } from './modules/table-button/table-button.module';
import { NaturalCommonModule } from './modules/common/common-module';
import { NaturalFixedButtonDetailModule } from './modules/fixed-button-detail/fixed-button-detail.module';
import { NaturalDetailHeaderModule } from './modules/detail-header/detail-header.module';

const importsToExport = [
    NaturalCommonModule,
    NaturalHierarchicSelectorModule,
    NaturalSidenavModule,
    NaturalIconModule,
    NaturalSelectModule,
    NaturalRelationsModule,
    NaturalAlertModule,
    NaturalColumnsPickerModule,
    NaturalSelectEnumModule,
    NaturalStampModule,
    NaturalDetailHeaderModule,
    NaturalTableButtonModule,
    NaturalFixedButtonModule,
    NaturalFixedButtonDetailModule,
];

@NgModule({
    imports: [
        ...importsToExport,
    ],
    exports: [
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
