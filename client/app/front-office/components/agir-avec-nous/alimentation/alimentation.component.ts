import {Component} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-alimentation',
    imports: [MatButton, RouterLink],
    templateUrl: './alimentation.component.html',
    styleUrl: './alimentation.component.scss',
})
export class AlimentationComponent {}
