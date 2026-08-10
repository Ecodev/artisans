import {Component, ChangeDetectionStrategy} from '@angular/core';
import {MatDivider} from '@angular/material/divider';

@Component({
    selector: 'app-points-de-vente',
    imports: [MatDivider],
    templateUrl: './points-de-vente.component.html',
    styleUrl: './points-de-vente.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class PointsDeVenteComponent {}
