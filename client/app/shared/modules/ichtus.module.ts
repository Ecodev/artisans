import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RelationsComponent } from '../components/relations/relations.component';
import { SelectComponent } from '../components/select/select.component';
import { MaterialModule } from './material.module';
import { ColumnsPickerComponent } from '../components/columns-picker/columns-picker.component';
import { ColumnsPickerColumnDirective } from '../components/columns-picker/columns-picker-column.directive';
import { TableButtonComponent } from '../../admin/shared/components/table-button/table-button.component';
import { FixedButtonComponent } from '../components/fixed-button/fixed-button.component';
import { DetailFixedButtonComponent } from '../components/detail-fixed-button/detail-fixed-button.component';
import { NaturalSearchModule } from '@ecodev/natural-search';
import { IconModule } from '../components/icon/icon.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AddressComponent } from '../components/address/address.component';
import { EnumPipe } from '../pipes/enum.pipe';
import { CapitalizePipe } from '../pipes/capitalize.pipe';
import { SelectEnumComponent } from '../components/select-enum/select-enum.component';
import { AvatarModule } from 'ngx-avatar';
import { MoneyComponent } from '../components/money/money.component';
import { BookableMetadataComponent } from '../components/bookable-metadata/bookable-metadata.component';
import { FocusDirective } from '../directives/focus';
import { CardComponent } from '../components/card/card.component';
import { ngfModule } from 'angular-file';
import { FileComponent } from '../components/file/file.component';
import { FileDropDirective } from '../components/file/services/file-drop.directive';
import { NavigationsComponent } from '../components/navigations/navigations.component';
import { CommentComponent } from '../components/navigations/comment.component';
import { TransactionAmountComponent } from '../components/transaction-amount/transaction-amount.component';
import { AccountingDocumentsComponent } from '../../admin/accounting-documents/accounting-documents.component';

const declarations = [
    RelationsComponent,
    SelectComponent,
    SelectEnumComponent,
    ColumnsPickerComponent,
    ColumnsPickerColumnDirective,
    TableButtonComponent,
    FixedButtonComponent,
    DetailFixedButtonComponent,
    AddressComponent,
    EnumPipe,
    CapitalizePipe,
    MoneyComponent,
    BookableMetadataComponent,
    FocusDirective,
    CardComponent,
    FileDropDirective,
    FileComponent,
    NavigationsComponent,
    CommentComponent,
    TransactionAmountComponent,
    AccountingDocumentsComponent
];

const imports = [
    CommonModule,
    MaterialModule,
    NaturalSearchModule,
    IconModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AvatarModule,
    ngfModule,
];

@NgModule({
    declarations: [...declarations],
    imports: [...imports],
    exports: [...imports, ...declarations],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    entryComponents: [CommentComponent],
})
export class IchtusModule {
}
