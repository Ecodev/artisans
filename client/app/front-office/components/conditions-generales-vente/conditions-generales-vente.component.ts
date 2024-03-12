import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {FlexModule} from '@ngbracket/ngx-layout/flex';

@Component({
    selector: 'app-conditions-generales-vente',
    templateUrl: './conditions-generales-vente.component.html',
    styleUrl: './conditions-generales-vente.component.scss',
    standalone: true,
    imports: [FlexModule, RouterLink],
})
export class ConditionsGeneralesVenteComponent {}
