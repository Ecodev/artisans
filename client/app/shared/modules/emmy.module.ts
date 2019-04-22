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
import { ParticleEffectButtonModule } from '@sambaptista/angular-particle-effect-button';
import { TransactionAmountComponent } from '../components/transaction-amount/transaction-amount.component';
import { AccountingDocumentsComponent } from '../../admin/accounting-documents/accounting-documents.component';
import { TimeagoModule } from 'ngx-timeago';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ParticleSwitchComponent } from '../components/particle-switch/particle-switch.component';
import { NaturalSearchModule } from '@ecodev/natural';
import {
    NaturalAlertModule,
    NaturalColumnsPickerModule,
    NaturalCommonModule,
    NaturalDetailHeaderModule,
    NaturalFixedButtonDetailModule,
    NaturalFixedButtonModule,
    NaturalHierarchicSelectorModule,
    NaturalIconModule,
    NaturalIconsConfig,
    NaturalRelationsModule,
    NaturalSelectEnumModule,
    NaturalSelectModule,
    NaturalSidenavModule,
    NaturalStampModule,
    NaturalTableButtonModule,
} from '@ecodev/natural';

const iconsConfig: NaturalIconsConfig = {
    'qr': {
        svg: 'assets/icons/qr.svg',
    },
    'simple-qr': {
        svg: 'assets/icons/simple-qr.svg',
    },
    'own_product': {
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
    'browse_products': {
        svg: 'assets/icons/search.svg',
    },
    'administrator': {
        svg: 'assets/icons/boss.svg',
    },
    'exit': {
        svg: 'assets/icons/exit.svg',
    },
    'emmy': {
        svg: 'assets/emmy.svg',
    },
};

const declarations = [
    AddressComponent,
    MoneyComponent,
    FocusDirective,
    CardComponent,
    FileDropDirective,
    FileComponent,
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
    entryComponents: [],
})
export class EmmyModule {
}
