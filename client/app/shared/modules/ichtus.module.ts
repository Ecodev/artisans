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

@NgModule({
    declarations: [
        RelationsComponent,
        SelectComponent,
        ColumnsPickerComponent,
        ColumnsPickerColumnDirective,
        TableButtonComponent,
        FixedButtonComponent,
        DetailFixedButtonComponent,
        AddressComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        NaturalSearchModule,
        IconModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
    ],
    exports: [
        RelationsComponent,
        SelectComponent,
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
    ],
})
export class IchtusModule {
}
