import {Component, ChangeDetectionStrategy} from '@angular/core';
import {NaturalSrcDensityDirective} from '@ecodev/natural';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-irremplacables-epiceries',
    imports: [NaturalSrcDensityDirective, RouterLink],
    templateUrl: './irremplacables-epiceries.component.html',
    styleUrl: './irremplacables-epiceries.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class IrremplacablesEpiceriesComponent {}
