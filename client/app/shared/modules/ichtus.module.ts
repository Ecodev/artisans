import { NgModule } from '@angular/core';
import { RelationsComponent } from '../components/relations/relations.component';
import { SelectComponent } from '../components/select/select.component';
import { MaterialModule } from './material.module';
import { ColumnsPickerComponent } from '../components/columns-picker/columns-picker.component';
import { ColumnsPickerColumnDirective } from '../components/columns-picker/columns-picker-column.directive';
import { TableButtonComponent } from '../../admin/shared/components/table-button/table-button.component';
import { FixedButtonComponent } from '../components/fixed-button/fixed-button.component';
import { DetailFixedButtonComponent } from '../components/detail-fixed-button/detail-fixed-button.component';
import { NaturalSearchModule } from '@ecodev/natural-search';
import { IconComponent } from '../components/icon/icon.component';
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

@NgModule({
    declarations: [
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
        BookableMetadataComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        NaturalSearchModule,
        IconModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        AvatarModule,
    ],
    exports: [
        RelationsComponent,
        SelectComponent,
        SelectEnumComponent,
        ColumnsPickerComponent,
        ColumnsPickerColumnDirective,
        TableButtonComponent,
        FixedButtonComponent,
        DetailFixedButtonComponent,
        MaterialModule,
        NaturalSearchModule,
        IconComponent,
        FormsModule,
        ReactiveFormsModule,
        AddressComponent,
        EnumPipe,
        CapitalizePipe,
        AvatarModule,
        MoneyComponent,
        BookableMetadataComponent
    ],
})
export class IchtusModule {
}
