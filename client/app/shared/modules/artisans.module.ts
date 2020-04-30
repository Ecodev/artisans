import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
    NaturalAlertModule,
    NaturalColumnsPickerModule,
    NaturalCommonModule,
    NaturalDetailHeaderModule,
    NaturalDialogTriggerModule,
    NaturalDropdownComponentsModule,
    NaturalFixedButtonDetailModule,
    NaturalFixedButtonModule,
    NaturalHierarchicSelectorModule,
    NaturalIconModule,
    NaturalIconsConfig,
    NaturalRelationsModule,
    NaturalSearchModule,
    NaturalSelectEnumModule,
    NaturalSelectModule,
    NaturalSidenavModule,
    NaturalStampModule,
    NaturalTableButtonModule,
} from '@ecodev/natural';
import { ngfModule } from 'angular-file';
import { ParticleEffectButtonModule } from 'angular-particle-effect-button';
import { AvatarModule } from 'ngx-avatar';
import { ProductsComponent } from '../../admin/products/products/products.component';
import { UsersComponent } from '../../admin/users/users/users.component';
import { AddressComponent } from '../components/address/address.component';
import { BreadcrumbsComponent } from '../components/breadcrumbs/breadcrumbs.component';
import { CardComponent } from '../components/card/card.component';
import { FileComponent } from '../components/file/file.component';
import { FileDropDirective } from '../components/file/services/file-drop.directive';
import { MoneyComponent } from '../components/money/money.component';
import { ParticleSwitchComponent } from '../components/particle-switch/particle-switch.component';
import { PriceComponent } from '../components/price/price.component';
import { TagsNavigationComponent } from '../components/tags-navigation/tags-navigation.component';
import { FocusDirective } from '../directives/focus';
import { MaterialModule } from './material.module';

const iconsConfig: NaturalIconsConfig = {};

const declarations = [
    AddressComponent,
    MoneyComponent,
    FocusDirective,
    CardComponent,
    FileDropDirective,
    FileComponent,
    ParticleSwitchComponent,
    UsersComponent,
    ProductsComponent,
    TagsNavigationComponent,
    PriceComponent,
    BreadcrumbsComponent,
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
    NaturalDropdownComponentsModule,
    NaturalDialogTriggerModule,
];

@NgModule({
    declarations: [...declarations],
    imports: [
        ...imports,
        NaturalIconModule.forRoot(iconsConfig),
    ],
    exports: [...imports, ...declarations, NaturalIconModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ArtisansModule {
}
