import {Component, ChangeDetectionStrategy} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-alimentation',
    imports: [MatButton, RouterLink],
    templateUrl: './alimentation.component.html',
    styleUrl: './alimentation.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class AlimentationComponent {}
