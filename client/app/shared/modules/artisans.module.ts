import {CommonModule} from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {
    NaturalAlertModule,
    NaturalAvatarModule,
    NaturalColumnsPickerModule,
    NaturalCommonModule,
    NaturalDetailHeaderModule,
    NaturalDialogTriggerModule,
    NaturalDropdownComponentsModule,
    NaturalEditorModule,
    NaturalFileModule,
    NaturalFixedButtonDetailModule,
    NaturalFixedButtonModule,
    NaturalHierarchicSelectorModule,
    NaturalIconModule,
    NaturalIconsConfig,
    NaturalRelationsModule,
    NaturalSearchModule,
    NaturalSelectModule,
    NaturalSidenavModule,
    NaturalStampModule,
    NaturalTableButtonModule,
} from '@ecodev/natural';
import {ProductsComponent} from '../../admin/products/products/products.component';
import {UsersComponent} from '../../admin/users/users/users.component';
import {AddressComponent} from '../components/address/address.component';
import {BreadcrumbsComponent} from '../components/breadcrumbs/breadcrumbs.component';
import {PriceComponent} from '../components/price/price.component';
import {TagsNavigationComponent} from '../components/tags-navigation/tags-navigation.component';
import {StripTagsPipe} from '../pipes/strip-tags.pipe';
import {TruncatePipe} from '../pipes/truncate.pipe';
import {MaterialModule} from './material.module';

const iconsConfig: NaturalIconsConfig = {};

const declarations = [
    AddressComponent,
    UsersComponent,
    ProductsComponent,
    TagsNavigationComponent,
    PriceComponent,
    BreadcrumbsComponent,
    TruncatePipe,
    StripTagsPipe,
];

const imports = [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NaturalAvatarModule,
    NaturalSearchModule,
    NaturalCommonModule,
    NaturalFileModule,
    NaturalHierarchicSelectorModule,
    NaturalSidenavModule,
    NaturalSelectModule,
    NaturalRelationsModule,
    NaturalAlertModule,
    NaturalColumnsPickerModule,
    NaturalStampModule,
    NaturalDetailHeaderModule,
    NaturalTableButtonModule,
    NaturalFixedButtonModule,
    NaturalFixedButtonDetailModule,
    NaturalDropdownComponentsModule,
    NaturalDialogTriggerModule,
    NaturalEditorModule,
];

@NgModule({
    declarations: [...declarations],
    imports: [...imports, NaturalIconModule.forRoot(iconsConfig)],
    exports: [...imports, ...declarations, NaturalIconModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ArtisansModule {}
