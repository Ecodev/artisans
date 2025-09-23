import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';

@Component({
    selector: 'app-bns',
    imports: [MatButton, RouterLink],
    templateUrl: './bns.component.html',
    styleUrl: './bns.component.scss',
})
export class BnsComponent {}
