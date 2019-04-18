import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material';
import { NaturalIconComponent } from './icon.component';

@NgModule({
    imports: [CommonModule, MatIconModule],
    declarations: [NaturalIconComponent],
    exports: [NaturalIconComponent],
})
export class NaturalIconModule {

}
