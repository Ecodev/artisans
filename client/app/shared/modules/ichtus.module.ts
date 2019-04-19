import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AddressComponent } from '../components/address/address.component';
import { AvatarModule } from 'ngx-avatar';
import { MoneyComponent } from '../components/money/money.component';
import { FocusDirective } from '../directives/focus';
import { CardComponent } from '../components/card/card.component';
import { ngfModule } from 'angular-file';
import { FileComponent } from '../components/file/file.component';
import { FileDropDirective } from '../components/file/services/file-drop.directive';
import { NavigationsComponent } from '../components/navigations/navigations.component';
import { CommentComponent } from '../components/navigations/comment.component';
import { ParticleEffectButtonModule } from '@sambaptista/angular-particle-effect-button';
import { TransactionAmountComponent } from '../components/transaction-amount/transaction-amount.component';
import { AccountingDocumentsComponent } from '../../admin/accounting-documents/accounting-documents.component';
import { TimeagoModule } from 'ngx-timeago';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ParticleSwitchComponent } from '../components/particle-switch/particle-switch.component';
import { NaturalSearchModule } from '@ecodev/natural-search';
import { NaturalIconsConfig } from '../../natural/modules/icon/icon.component';
import { NaturalCommonModule } from '../../natural/modules/common/common-module';
import { NaturalHierarchicSelectorModule } from '../../natural/modules/hierarchic-selector/hierarchic-selector.module';
import { NaturalSidenavModule } from '../../natural/modules/sidenav/sidenav.module';
import { NaturalIconModule } from '../../natural/modules/icon/icon.module';
import { NaturalSelectModule } from '../../natural/modules/select/select.module';
import { NaturalRelationsModule } from '../../natural/modules/relations/relations.module';
import { NaturalAlertModule } from '../../natural/modules/alert/alert.module';
import { NaturalColumnsPickerModule } from '../../natural/modules/columns-picker/columns-picker.module';
import { NaturalSelectEnumModule } from '../../natural/modules/select-enum/select-enum.module';
import { NaturalStampModule } from '../../natural/modules/stamp/stamp-module.module';
import { NaturalDetailHeaderModule } from '../../natural/modules/detail-header/detail-header.module';
import { NaturalTableButtonModule } from '../../natural/modules/table-button/table-button.module';
import { NaturalFixedButtonModule } from '../../natural/modules/fixed-button/fixed-button.module';
import { NaturalFixedButtonDetailModule } from '../../natural/modules/fixed-button-detail/fixed-button-detail.module';

const iconsConfig: NaturalIconsConfig = {
    'qr': {
        svg: 'assets/icons/qr.svg',
    },
    'simple-qr': {
        svg: 'assets/icons/simple-qr.svg',
    },
    'own_bookable': {
        svg: 'assets/icons/swimsuit.svg',
    },
    'code': {
        svg: 'assets/icons/input.svg',
    },
    'doors': {
        svg: 'assets/icons/key.svg',
    },
    'family': {
        svg: 'assets/icons/family.svg',
    },
    'lake': {
        svg: 'assets/icons/lake.svg',
    },
    'transactionHistory': {
        svg: 'assets/icons/history.svg',
    },
    'claims': {
        svg: 'assets/icons/claims.svg',
    },
    'finances': {
        svg: 'assets/icons/notes.svg',
    },
    'browse_bookables': {
        svg: 'assets/icons/search.svg',
    },
    'administrator': {
        svg: 'assets/icons/boss.svg',
    },
    'exit': {
        svg: 'assets/icons/exit.svg',
    },
    'ichtus': {
        svg: 'assets/ichtus.svg',
    },
};

const declarations = [
    AddressComponent,
    MoneyComponent,
    FocusDirective,
    CardComponent,
    FileDropDirective,
    FileComponent,
    NavigationsComponent,
    CommentComponent,
    TransactionAmountComponent,
    AccountingDocumentsComponent,
    ParticleSwitchComponent,
];

const imports = [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AvatarModule,
    ngfModule,
    ParticleEffectButtonModule,
    NaturalSearchModule,
    NaturalCommonModule,
    NaturalHierarchicSelectorModule,
    NaturalSidenavModule,
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
    declarations: [...declarations],
    imports: [
        ...imports,
        NaturalIconModule.forRoot(iconsConfig),
    ],
    exports: [...imports, ...declarations, TimeagoModule, NaturalIconModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    entryComponents: [CommentComponent],
})
export class IchtusModule {
}
