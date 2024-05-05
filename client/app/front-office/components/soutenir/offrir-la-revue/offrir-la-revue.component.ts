import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';

@Component({
    selector: 'app-offrir-la-revue',
    templateUrl: './offrir-la-revue.component.html',
    styleUrl: './offrir-la-revue.component.scss',
    standalone: true,
    imports: [MatButtonModule, RouterLink],
})
export class OffrirLaRevueComponent {}
