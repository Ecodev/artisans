import {Component} from '@angular/core';
import {MatAnchor} from '@angular/material/button';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-alimentation',
    templateUrl: './alimentation.component.html',
    styleUrl: './alimentation.component.scss',
    imports: [MatAnchor, RouterLink],
})
export class AlimentationComponent {}
