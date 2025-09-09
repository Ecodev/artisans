import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';

@Component({
    selector: 'app-bns',
    imports: [MatButtonModule, RouterLink],
    templateUrl: './bns.component.html',
    styleUrl: './bns.component.scss',
})
export class BnsComponent {}
