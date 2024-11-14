import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatAnchor} from '@angular/material/button';

@Component({
    selector: 'app-alimentation',
    templateUrl: './alimentation.component.html',
    styleUrl: './alimentation.component.scss',
    standalone: true,
    imports: [RouterLink, MatAnchor],
})
export class AlimentationComponent {}
