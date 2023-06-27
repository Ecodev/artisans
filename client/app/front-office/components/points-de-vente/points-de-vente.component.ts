import {Component} from '@angular/core';
import {MatDividerModule} from '@angular/material/divider';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

@Component({
    selector: 'app-points-de-vente',
    templateUrl: './points-de-vente.component.html',
    styleUrls: ['./points-de-vente.component.scss'],
    standalone: true,
    imports: [FlexModule, MatDividerModule],
})
export class PointsDeVenteComponent {}
