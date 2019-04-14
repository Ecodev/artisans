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
import { NaturalModule } from '../../natural/natural.module';
import { NaturalSearchModule } from '@ecodev/natural-search';

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
    NaturalModule,
    NaturalSearchModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AvatarModule,
    ngfModule,
    ParticleEffectButtonModule,
];

@NgModule({
    declarations: [...declarations],
    imports: [...imports],
    exports: [...imports, ...declarations, TimeagoModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    entryComponents: [CommentComponent],
})
export class IchtusModule {
}
