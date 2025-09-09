import {Component} from '@angular/core';
import {MatAnchor} from '@angular/material/button';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-alimentation',
    imports: [MatAnchor, RouterLink],
    templateUrl: './alimentation.component.html',
    styleUrl: './alimentation.component.scss',
})
export class AlimentationComponent {}
