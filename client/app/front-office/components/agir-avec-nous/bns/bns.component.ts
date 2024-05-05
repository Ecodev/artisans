import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';

import {MatButtonModule} from '@angular/material/button';

@Component({
    selector: 'app-bns',
    templateUrl: './bns.component.html',
    styleUrl: './bns.component.scss',
    standalone: true,
    imports: [MatButtonModule, RouterLink],
})
export class BnsComponent {}
