import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material';
import { NaturalIconComponent } from './icon.component';

@NgModule({
    declarations: [
        NaturalIconComponent,
    ],
    imports: [
        CommonModule,
        MatIconModule,
    ],
    exports: [
        NaturalIconComponent,
    ],
})
export class NaturalIconModule {

}
