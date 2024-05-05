import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-circuits-courts',
    templateUrl: './circuits-courts.component.html',
    styleUrl: './circuits-courts.component.scss',
    standalone: true,
    imports: [RouterLink],
})
export class CircuitsCourtsComponent {}
