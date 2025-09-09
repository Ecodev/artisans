import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NaturalSrcDensityDirective} from '@ecodev/natural';

@Component({
    selector: 'app-circuits-courts',
    imports: [RouterLink, NaturalSrcDensityDirective],
    templateUrl: './circuits-courts.component.html',
    styleUrl: './circuits-courts.component.scss',
})
export class CircuitsCourtsComponent {}
