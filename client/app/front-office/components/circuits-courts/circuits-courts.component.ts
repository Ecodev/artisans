import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NaturalSrcDensityDirective} from '@ecodev/natural';

@Component({
    selector: 'app-circuits-courts',
    templateUrl: './circuits-courts.component.html',
    styleUrl: './circuits-courts.component.scss',
    imports: [RouterLink, NaturalSrcDensityDirective],
})
export class CircuitsCourtsComponent {}
