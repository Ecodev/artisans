import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';

@Component({
    selector: 'app-offrir-la-revue',
    imports: [MatButton, RouterLink],
    templateUrl: './offrir-la-revue.component.html',
    styleUrl: './offrir-la-revue.component.scss',
})
export class OffrirLaRevueComponent {}
