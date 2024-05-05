import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-alimentation',
    templateUrl: './alimentation.component.html',
    styleUrl: './alimentation.component.scss',
    standalone: true,
    imports: [RouterLink],
})
export class AlimentationComponent {}
